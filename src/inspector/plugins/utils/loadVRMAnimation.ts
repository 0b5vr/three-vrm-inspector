import type { VRM } from '@pixiv/three-vrm';
import {
  createVRMAnimationClip,
  type VRMAnimation,
  VRMAnimationLoaderPlugin,
} from '@pixiv/three-vrm-animation';
import type * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function loadVRMAniamtion(
  name: string,
  vrm: VRM,
): Promise<THREE.AnimationClip> {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
  const gltf = await loader.loadAsync(name);
  const vrmAnimation: VRMAnimation = gltf.userData.vrmAnimations[0];
  return createVRMAnimationClip(vrmAnimation, vrm);
}
