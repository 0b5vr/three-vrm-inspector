import * as THREE from 'three';
import { type GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader.js';
import vertexShader from './material-debugger.vert?raw';
import fragmentShader from './material-debugger.frag?raw';

enum RenderQueueFillPattern {
  Solid,
  Checker,
  HorizontalStripe,
  DiagonalStripe,
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



function getMaterialRenderQueue(material: THREE.Material, parser: GLTFParser): number {
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

export class RenderQueueMaterial extends THREE.ShaderMaterial {
  constructor(originalMaterial: THREE.Material, parser: GLTFParser) {
    const fillPattern = getRenderQueueFillPattern(originalMaterial);
    const renderQueue = getMaterialRenderQueue(originalMaterial, parser);

    super({
      depthWrite: originalMaterial.depthWrite,
      transparent: originalMaterial.transparent,
      uniforms: {
        uRenderQueue: { value: renderQueue },
        uFillPattern: { value: fillPattern },
      },
      vertexShader,
      fragmentShader,
      toneMapped: false,
    });
  }
}
