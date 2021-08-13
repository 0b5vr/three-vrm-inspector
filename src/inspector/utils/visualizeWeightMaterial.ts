import * as THREE from 'three';

export class MeshVisualizeWeightMaterial extends THREE.MeshNormalMaterial {
  private _skinIndexVisualize: number;

  public get skinIndexVisualize(): number {
    return this._skinIndexVisualize;
  }

  public set skinIndexVisualize( index: number ) {
    if ( this._uniforms ) {
      this._uniforms.skinIndexVisualize = { value: index };
    }

    this._skinIndexVisualize = index;
  }

  private _uniforms?: { [ uniform: string ]: THREE.IUniform };

  public constructor( parameters: THREE.MeshNormalMaterialParameters ) {
    super( parameters );

    this._skinIndexVisualize = 0;

    // See: https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl.js
    this.onBeforeCompile = ( shader ) => {
      this._uniforms = shader.uniforms;
      this._uniforms.skinIndexVisualize = { value: this._skinIndexVisualize };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>

        varying float vWeightVisualize;
        uniform float skinIndexVisualize;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#ifdef USE_SKINNING
          vWeightVisualize = (
            skinIndex.x == skinIndexVisualize ? skinWeight.x : 0.0 +
            skinIndex.y == skinIndexVisualize ? skinWeight.y : 0.0 +
            skinIndex.z == skinIndexVisualize ? skinWeight.z : 0.0 +
            skinIndex.w == skinIndexVisualize ? skinWeight.w : 0.0
          );
        #else
          vWeightVisualize = 0.0;
        #endif

        #include <begin_vertex>`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <packing>',
        `#include <packing>

        varying float vWeightVisualize;`
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( packNormalToRGB( normal ), opacity );',
        `gl_FragColor = vec4(
          clamp( 2.0 - abs( vec3( 4.0, 2.0, 0.0 ) - 4.0 * vWeightVisualize ), 0.0, 1.0 ),
          opacity
        );`
      );
    };
  }
}

export const visualizeWeightMaterial = new MeshVisualizeWeightMaterial( {
  transparent: true,
  skinning: true,
  morphTargets: true,
  morphNormals: true,
  depthTest: false,
  depthWrite: false,
} );
