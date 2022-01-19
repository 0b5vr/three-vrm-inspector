import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM } from '@pixiv/three-vrm';
import { ValidationReport } from './ValidationReport';
import type { GLTF as GLTFSchema } from '@gltf-transform/core';

export interface InspectorModel {
  gltf: GLTF;
  validationReport: ValidationReport;
  originalGLTFJSON: GLTFSchema.IGLTF;
  vrm: VRM | null;
  scene: THREE.Group;
  animationMixer: THREE.AnimationMixer | null;
}
