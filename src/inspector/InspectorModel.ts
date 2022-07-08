import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM } from '@pixiv/three-vrm';
import type { GLTF as GLTFSchema } from '@gltf-transform/core';

export interface InspectorModel {
  buffer: ArrayBuffer;
  gltf: GLTF;
  originalGLTFJSON: GLTFSchema.IGLTF;
  vrm: VRM | null;
  scene: THREE.Group;
}
