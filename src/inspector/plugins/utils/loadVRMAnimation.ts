import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM } from '@pixiv/three-vrm';
import { VRMAnimation, VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

export async function loadVRMAniamtion( name: string, vrm: VRM ): Promise<THREE.AnimationClip> {
  const loader = new GLTFLoader();
  loader.register( ( parser ) => new VRMAnimationLoaderPlugin( parser ) );
  const gltf = await loader.loadAsync( name );
  const vrmAnimation: VRMAnimation = gltf.userData.vrmAnimations[ 0 ];
  return createVRMAnimationClip( vrmAnimation, vrm );
}
