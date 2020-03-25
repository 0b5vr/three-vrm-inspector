import * as THREE from 'three';
import { GLTFMesh, MToonMaterial, MToonMaterialDebugMode } from '@pixiv/three-vrm';
import { Inspector } from './Inspector';
import imageUVGrid from '../assets/uv-grid.png';

export enum MaterialDebuggerMode {
  None,
  GLTFFallback,
  MToonNormal,
  MToonLitShadeRate,
  MToonUV,
  UVGrid,
}

// == override materials ===========================================================================
const invisibleMaterial = new THREE.MeshBasicMaterial( {
  visible: false,
  skinning: true,
  morphTargets: true,
} );

const promiseTextureUVGrid = new Promise<THREE.Texture>( ( resolve ) => {
  const loader = new THREE.TextureLoader();
  loader.load( imageUVGrid, ( texture ) => {
    resolve( texture );
  } );
} );

function createMaterialUVGrid( original: THREE.Material ): THREE.Material {
  const material = new THREE.MeshBasicMaterial( {
    skinning: ( original as any ).skinning,
    morphTargets: ( original as any ).morphTargets,
    color: 0xff00ff,
  } );

  promiseTextureUVGrid.then( ( texture ) => {
    material.map = texture;
    material.color.set( 0xffffff );
  } );

  return material;
}

// == helpers ======================================================================================
function setMToonDebugMode( material: THREE.Material, mode: MToonMaterialDebugMode ): void {
  if ( 'isMToonMaterial' in material ) {
    const mToon = material as MToonMaterial;
    mToon.debugMode = mode;
  }
}

function isMToonOutline( material: THREE.Material ): boolean {
  if ( !( 'isMToonMaterial' in material ) ) { return false; }
  const mToon = material as MToonMaterial;
  return mToon.isOutline;
}

// == class ========================================================================================
export class MaterialDebugger {
  private _vrmMaterialsByMesh = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  private _inspector: Inspector;

  public constructor( inspector: Inspector ) {
    this._inspector = inspector;

    this._inspector.on( 'load', () => this._handleLoad() );
    this._inspector.on( 'unload', () => this._handleUnload() );
  }

  public applyMode( mode: MaterialDebuggerMode ): void {
    if ( mode === MaterialDebuggerMode.None ) {
      this._applyModeMToon( MToonMaterialDebugMode.None );
    } else if ( mode === MaterialDebuggerMode.MToonNormal ) {
      this._applyModeMToon( MToonMaterialDebugMode.Normal );
    } else if ( mode === MaterialDebuggerMode.MToonLitShadeRate ) {
      this._applyModeMToon( MToonMaterialDebugMode.LitShadeRate );
    } else if ( mode === MaterialDebuggerMode.MToonUV ) {
      this._applyModeMToon( MToonMaterialDebugMode.UV );
    } else if ( mode === MaterialDebuggerMode.UVGrid ) {
      this._applyModeUVGrid();
    }
  }

  private _applyModeMToon( mode: MToonMaterialDebugMode ): void {
    for ( const [ mesh, materialOrMaterials ] of this._vrmMaterialsByMesh.entries() ) {
      if ( Array.isArray( materialOrMaterials ) ) {
        materialOrMaterials.forEach( ( material, iMaterial ) => {
          setMToonDebugMode( material, mode );
          ( mesh.material as THREE.Material[] )[ iMaterial ] = material;
        } );
      } else {
        setMToonDebugMode( materialOrMaterials, mode );
        ( mesh.material as THREE.Material ) = materialOrMaterials;
      }
    }
  }

  private _applyModeUVGrid(): void {
    for ( const [ mesh, materialOrMaterials ] of this._vrmMaterialsByMesh.entries() ) {
      if ( Array.isArray( materialOrMaterials ) ) {
        materialOrMaterials.forEach( ( material, iMaterial ) => {
          if ( isMToonOutline( material ) ) {
            ( mesh.material as THREE.Material[] )[ iMaterial ] = invisibleMaterial;
          } else {
            ( mesh.material as THREE.Material[] )[ iMaterial ] = createMaterialUVGrid( material );
          }
        } );
      } else {
        if ( isMToonOutline( materialOrMaterials ) ) {
          ( mesh.material as THREE.Material ) = invisibleMaterial;
        } else {
          ( mesh.material as THREE.Material ) = createMaterialUVGrid( materialOrMaterials );
        }
      }
    }
  }

  private async _handleLoad(): Promise<void> {
    const gltfMeshes = await this._inspector.gltf!.parser.getDependencies( 'mesh' );
    gltfMeshes.forEach( ( gltfMesh: GLTFMesh ) => {
      if ( 'isGroup' in gltfMesh ) {
        const group = gltfMesh as THREE.Group;
        group.children.forEach( ( object ) => {
          const mesh = object as THREE.Mesh;
          this._addManagedMesh( mesh );
        } );
      } else {
        const mesh = gltfMesh as THREE.Mesh;
        this._addManagedMesh( mesh );
      }
    } );
  }

  private _addManagedMesh( mesh: THREE.Mesh ): void {
    if ( Array.isArray( mesh.material ) ) {
      this._vrmMaterialsByMesh.set( mesh, mesh.material.concat() );
    } else {
      this._vrmMaterialsByMesh.set( mesh, mesh.material );
    }
  }

  private _handleUnload(): void {
    this._vrmMaterialsByMesh.clear();
  }
}
