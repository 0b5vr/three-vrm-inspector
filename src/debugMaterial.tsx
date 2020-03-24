import * as THREE from 'three';
import { MToonMaterial, MToonMaterialDebugMode } from '@pixiv/three-vrm';
import { Inspector } from './Inspector';

export enum DebugMaterialMode {
  None,
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

export function debugMaterial( inspector: Inspector, mode: DebugMaterialMode ): void {
  let mToonDebugMode = MToonMaterialDebugMode.None;
  if ( mode === DebugMaterialMode.MToonNormal ) {
    mToonDebugMode = MToonMaterialDebugMode.Normal;
  } else if ( mode === DebugMaterialMode.MToonLitShadeRate ) {
    mToonDebugMode = MToonMaterialDebugMode.LitShadeRate;
  } else if ( mode === DebugMaterialMode.MToonUV ) {
    mToonDebugMode = MToonMaterialDebugMode.UV;
  }

  inspector.scene.traverse( ( object ) => {
    if ( 'isMesh' in object ) {
      const mesh = object as THREE.Mesh;
      if ( Array.isArray( mesh.material ) ) {
        mesh.material.forEach( ( material ) => {
          setMToonDebugMode( material, mToonDebugMode );
        } );
      } else {
        setMToonDebugMode( mesh.material, mToonDebugMode );
      }
    }
  } );
}
