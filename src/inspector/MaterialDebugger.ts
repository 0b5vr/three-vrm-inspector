import * as THREE from 'three';
import { Inspector } from './Inspector';
import { MToonMaterial, MToonMaterialDebugMode } from '@pixiv/three-vrm';
import imageUVGrid from '../assets/uv-grid.png';

export enum MaterialDebuggerMode {
  None,
  GLTFFallback,
  MToonNormal,
  MToonLitShadeRate,
  MToonUV,
  UVGrid,
  RenderQueue,
}

enum RenderQueueFillPattern {
  Solid,
  Checker,
  HorizontalStripe,
  DiagonalStripe,
}

// == override materials ===========================================================================
const invisibleMaterial = new THREE.MeshBasicMaterial({
  visible: false,
});

const promiseTextureUVGrid = new Promise<THREE.Texture>((resolve) => {
  const loader = new THREE.TextureLoader();
  loader.load(imageUVGrid, (texture) => {
    texture.flipY = false;
    resolve(texture);
  });
});

function createMaterialUVGrid(): THREE.Material {
  const material = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
  });

  promiseTextureUVGrid.then((texture) => {
    material.map = texture;
    material.color.set(0xffffff);
  });

  return material;
}

function createMaterialRenderQueue(renderQueue: number, originalMaterial: THREE.Material): THREE.Material {
  const fillPattern = getRenderQueueFillPattern(originalMaterial);

  return new THREE.ShaderMaterial({
    depthWrite: originalMaterial.depthWrite,
    transparent: originalMaterial.transparent,
    uniforms: {
      uRenderQueue: { value: renderQueue },
      uFillPattern: { value: fillPattern },
    },
    vertexShader: /* glsl */`
      #include <common>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>

      void main() {
        #include <skinbase_vertex>

        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uRenderQueue;
      uniform float uFillPattern;

      #include <common>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>

      /*!
       * Polynomial approximation of the Turbo Colormap
       * (c) 2019 Google LLC., Apache License 2.0
       */
      vec3 TurboColormap(in float x) {
        const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
        const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
        const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
        const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
        const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
        const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);
        
        x = clamp(x, 0.0, 1.0);
        vec4 v4 = vec4(1.0, x, x * x, x * x * x);
        vec2 v2 = v4.zw * v4.z;
        return vec3(
          dot(v4, kRedVec4)   + dot(v2, kRedVec2),
          dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
          dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
        );
      }

      vec3 hslToRgb(vec3 hsl) {
        vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
      }

      float getFillPattern() {
        if (uFillPattern == 0.0) {
          return 1.0;
        } else if (uFillPattern == 1.0) {
          vec2 c4 = mod(floor(gl_FragCoord.xy), 4.0);
          return 1.0 - float(c4.x == 0.0 && c4.y == 0.0) - float(c4.x == 2.0 && c4.y == 2.0);
        } else if (uFillPattern == 2.0) {
          float stripe = floor(gl_FragCoord.y / 3.0);
          return mod(stripe, 2.0);
        } else {
          float stripe = floor((gl_FragCoord.x + gl_FragCoord.y) / 3.0);
          return mod(stripe, 2.0);
        }
      }

      void main() {
        #include <clipping_planes_fragment>

        vec3 color = TurboColormap(uRenderQueue / 19.0);
        color = mix(vec3(1.0), color, 0.4 + 0.5 * getFillPattern());

        #include <logdepthbuf_fragment>

        gl_FragColor = vec4(color, 1.0);
      }
    `,
    toneMapped: false,
  });
}

// == helpers ======================================================================================
function setMToonDebugMode(material: THREE.Material, mode: MToonMaterialDebugMode): void {
  if ('isMToonMaterial' in material) {
    const mToon = material as MToonMaterial;
    mToon.debugMode = mode;
  }
}

function isMToonOutline(material: THREE.Material): boolean {
  if (!('isMToonMaterial' in material)) { return false; }
  const mToon = material as MToonMaterial;
  return mToon.isOutline;
}

function getRenderQueueFillPattern(material: THREE.Material): RenderQueueFillPattern {
  if (material.transparent && material.depthWrite) {
    return RenderQueueFillPattern.DiagonalStripe;
  } else if (material.transparent) {
    return RenderQueueFillPattern.HorizontalStripe;
  } else if (material.alphaTest > 0.0) {
    return RenderQueueFillPattern.Checker;
  }

  return RenderQueueFillPattern.Solid;
}

// == class ========================================================================================
export class MaterialDebugger {
  private _currentMode = MaterialDebuggerMode.None;
  private _vrmMaterialsByMesh = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  private _inspector: Inspector;

  public constructor(inspector: Inspector) {
    this._inspector = inspector;

    this._inspector.on('load', () => this._handleLoad());
    this._inspector.on('unload', () => this._handleUnload());
  }

  public applyMode(mode: MaterialDebuggerMode): void {
    if (mode === MaterialDebuggerMode.None) {
      this._applyModeMToon(MToonMaterialDebugMode.None);
    } else if (mode === MaterialDebuggerMode.MToonNormal) {
      this._applyModeMToon(MToonMaterialDebugMode.Normal);
    } else if (mode === MaterialDebuggerMode.MToonLitShadeRate) {
      this._applyModeMToon(MToonMaterialDebugMode.LitShadeRate);
    } else if (mode === MaterialDebuggerMode.MToonUV) {
      this._applyModeMToon(MToonMaterialDebugMode.UV);
    } else if (mode === MaterialDebuggerMode.UVGrid) {
      this._applyModeUVGrid();
    } else if (mode === MaterialDebuggerMode.RenderQueue) {
      this._applyModeRenderQueue();
    }

    this._currentMode = mode;
  }

  private _applyModeMToon(mode: MToonMaterialDebugMode): void {
    for (const [mesh, materialOrMaterials] of this._vrmMaterialsByMesh.entries()) {
      if (Array.isArray(materialOrMaterials)) {
        materialOrMaterials.forEach((material, iMaterial) => {
          setMToonDebugMode(material, mode);
          (mesh.material as THREE.Material[])[iMaterial] = material;
        });
      } else {
        setMToonDebugMode(materialOrMaterials, mode);
        (mesh.material as THREE.Material) = materialOrMaterials;
      }
    }
  }

  private _applyModeUVGrid(): void {
    for (const [mesh, materialOrMaterials] of this._vrmMaterialsByMesh.entries()) {
      if (Array.isArray(materialOrMaterials)) {
        materialOrMaterials.forEach((material, iMaterial) => {
          if (isMToonOutline(material)) {
            (mesh.material as THREE.Material[])[iMaterial] = invisibleMaterial;
          } else {
            (mesh.material as THREE.Material[])[iMaterial] = createMaterialUVGrid();
          }
        });
      } else {
        if (isMToonOutline(materialOrMaterials)) {
          (mesh.material as THREE.Material) = invisibleMaterial;
        } else {
          (mesh.material as THREE.Material) = createMaterialUVGrid();
        }
      }
    }
  }

  private _getMaterialRenderQueue(material: THREE.Material): number {
    const parser = this._inspector.model?.gltf?.parser;
    if (parser == null) {
      return 0;
    }

    const association = parser.associations.get(material);
    if (association == null) {
      return 0;
    }

    const materialIndex = association.materials;
    if (materialIndex == null) {
      return 0;
    }

    const gltfMaterial = parser.json.materials?.[materialIndex];
    if (gltfMaterial == null) {
      return 0;
    }

    if (gltfMaterial.alphaMode !== 'BLEND') {
      return 0;
    }

    const mToonExtension = gltfMaterial.extensions?.['VRMC_materials_mtoon'];
    if (mToonExtension == null) {
      return 19;
    }

    const transparentWithZWrite = mToonExtension.transparentWithZWrite;
    return (transparentWithZWrite ? 0 : 19) + (mToonExtension.renderQueueOffsetNumber ?? 0);
  }

  private _applyModeRenderQueue(): void {
    for (const mesh of this._vrmMaterialsByMesh.keys()) {
      this._forEachMeshMaterial(mesh, (material) => {
        if (isMToonOutline(material)) {
          return invisibleMaterial;
        } else {
          const renderQueue = this._getMaterialRenderQueue(material);
          return createMaterialRenderQueue(renderQueue, material);
        }
      });
    }
  }

  private async _handleLoad(): Promise<void> {
    const meshes: Array<THREE.Group | THREE.Mesh | THREE.SkinnedMesh> = await this._inspector.model!.gltf!.parser.getDependencies('mesh');
    meshes.forEach((meshOrGroup) => {
      if (meshOrGroup instanceof THREE.Mesh) {
        this._addManagedMesh(meshOrGroup);
      } else {
        meshOrGroup.children.forEach((child) => {
          // mesh descendants might have joints
          if (child instanceof THREE.Mesh) {
            this._addManagedMesh(child);
          }
        });
      }
    });

    this.applyMode(this._currentMode);
  }

  private _addManagedMesh(mesh: THREE.Mesh): void {
    if (Array.isArray(mesh.material)) {
      this._vrmMaterialsByMesh.set(mesh, mesh.material.concat());
    } else {
      this._vrmMaterialsByMesh.set(mesh, mesh.material);
    }
  }

  private _forEachMeshMaterial(mesh: THREE.Mesh, callback: (material: THREE.Material) => THREE.Material): void {
    const materialOrMaterials = this._vrmMaterialsByMesh.get(mesh);
    if (materialOrMaterials == null) { return; }

    if (Array.isArray(materialOrMaterials)) {
      for (let i = 0; i < materialOrMaterials.length; i++) {
        (mesh.material as THREE.Material[])[i] = callback(materialOrMaterials[i]);
      }
    } else {
      mesh.material = callback(materialOrMaterials);
    }
  }

  private _handleUnload(): void {
    this._vrmMaterialsByMesh.clear();
  }
}
