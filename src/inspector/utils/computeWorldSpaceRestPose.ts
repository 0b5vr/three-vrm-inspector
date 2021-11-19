import * as THREE from 'three';
import { VRM, VRMHumanBoneName, VRMPose } from '@pixiv/three-vrm';

const _v3A = new THREE.Vector3();
const _quatA = new THREE.Quaternion();

export function computeWorldSpaceRestPose( vrm: VRM ): VRMPose | null {
  const humanoid = vrm.humanoid;
  if ( humanoid == null ) { return null; }

  const currentPose = humanoid.getPose();

  const worldSpaceRestPose: VRMPose = {};
  Object.entries( humanoid.humanBones ).map( ( [ name, bone ] ) => {
    if ( bone != null ) {
      const node = bone.node;
      worldSpaceRestPose[ name as VRMHumanBoneName ] = {
        position: node.getWorldPosition( _v3A ).toArray() as [ number, number, number ],
        rotation: node.getWorldQuaternion( _quatA ).toArray() as [ number, number, number, number ],
      };
    }
  } );

  humanoid.setPose( currentPose );

  return worldSpaceRestPose;
}
