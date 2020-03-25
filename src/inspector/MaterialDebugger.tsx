import * as THREE from 'three';
import { MToonMaterial, MToonMaterialDebugMode } from '@pixiv/three-vrm';
import { Inspector } from './Inspector';

export enum MaterialDebuggerMode {
  None,
  GLTFFallback,
  MToonNormal,
  MToonLitShadeRate,
  MToonUV,
}

function setMToonDebugMode( material: THREE.Material, mode: MToonMaterialDebugMode ): void {
  if ( 'isMToonMaterial' in material ) {
    const mToon = material as MToonMaterial;
    mToon.debugMode = mode;
  }
}

export class MaterialDebugger {
  private _inspector: Inspector;

  public constructor( inspector: Inspector ) {
    this._inspector = inspector;
  }

  public applyMode( mode: MaterialDebuggerMode ): void {
    const inspector = this._inspector;

    let mToonDebugMode = MToonMaterialDebugMode.None;
    if ( mode === MaterialDebuggerMode.MToonNormal ) {
      mToonDebugMode = MToonMaterialDebugMode.Normal;
    } else if ( mode === MaterialDebuggerMode.MToonLitShadeRate ) {
      mToonDebugMode = MToonMaterialDebugMode.LitShadeRate;
    } else if ( mode === MaterialDebuggerMode.MToonUV ) {
      mToonDebugMode = MToonMaterialDebugMode.UV;
    }

    const materialSet = new Set<THREE.Material>();
    inspector.scene.traverse( ( object ) => {
      if ( 'isMesh' in object ) {
        const mesh = object as THREE.Mesh;
        if ( Array.isArray( mesh.material ) ) {
          mesh.material.forEach( ( material ) => {
            materialSet.add( material );
          } );
        } else {
          materialSet.add( mesh.material );
        }
      }
    } );

    for ( const material of materialSet ) {
      setMToonDebugMode( material, mToonDebugMode );
    }
  }
}
