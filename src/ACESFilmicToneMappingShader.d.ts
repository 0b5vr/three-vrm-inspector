// TODO: delete after three-ts-types merges its #225
// https://github.com/three-types/three-ts-types/pull/225
declare module 'three/examples/jsm/shaders/ACESFilmicToneMappingShader' {
  import * as THREE from 'three';

  export const ACESFilmicToneMappingShader: {
    uniforms: {
      tDiffuse: THREE.IUniform<THREE.Texture>;
      exposure: THREE.IUniform<number>;
    };
    vertexShader: string;
    fragmentShader: string;
  };
}
