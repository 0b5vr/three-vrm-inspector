import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';

export function createAxisHelpers( vrm: VRM ): void {
  const humanBones = vrm.humanoid?.humanBones;
  if ( humanBones ) {
    for ( const bone of Object.values( humanBones ) ) {
      const helper = new THREE.AxesHelper( 0.1 );

      helper.renderOrder = 10000;
      ( helper.material as THREE.Material ).depthTest = false;
      ( helper.material as THREE.Material ).depthWrite = false;

      bone[ 0 ]?.node.add( helper );
    }
  }
}
