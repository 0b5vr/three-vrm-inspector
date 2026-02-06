import type { GLTF as GLTFSchema } from '@gltf-transform/core';
import type { VRM } from '@pixiv/three-vrm';
import type * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface InspectorModel {
  buffer: ArrayBuffer;
  gltf: GLTF;
  originalGLTFJSON: GLTFSchema.IGLTF;
  vrm: VRM | null;
  scene: THREE.Group;
}
