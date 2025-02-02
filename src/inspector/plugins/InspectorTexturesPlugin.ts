import * as THREE from 'three';
import { EventEmittable } from '../../utils/EventEmittable';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';
import { applyMixins } from '../../utils/applyMixins';

const _v2A = new THREE.Vector2();

export interface InspectorTexturesPluginInfo {
  name: string;
  width: number;
  height: number;
  mimeType: string | null;
  iTexture: number;
  iImage: number | undefined;
  iBufferView: number | undefined;
  byteLength: number | undefined;
  image: ImageBitmap;
  texture: THREE.Texture;
  promiseBlob: Promise<Blob>;
}

const fsqMaterial = new THREE.ShaderMaterial( {
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D( tDiffuse, vUv );
    }
  `,
} );

const fsq = new FullScreenQuad( fsqMaterial );

function textureToBlob(
  renderer: THREE.WebGLRenderer,
  texture: THREE.Texture,
  width: number,
  height: number,
): Promise<Blob> {
  return new Promise( ( resolve, reject ) => {
    renderer.getSize( _v2A );

    renderer.setSize( width, height );
    renderer.clear();

    fsqMaterial.uniforms.tDiffuse.value = texture;
    fsq.render( renderer );

    renderer.domElement.toBlob( ( blob ) => {
      if ( blob != null ) {
        resolve( blob );
      } else {
        reject( 'Failed to convert texture to blob.' );
      }
    }, 'image/png' );

    renderer.setSize( _v2A.x, _v2A.y );
  } );
}

interface InspectorTexturesPluginEvents {
  updateTextureInfos: { textureInfos: InspectorTexturesPluginInfo[] | null };
}

export interface InspectorTexturesPlugin extends EventEmittable<InspectorTexturesPluginEvents> {}
export class InspectorTexturesPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private __textureInfos: InspectorTexturesPluginInfo[] | null;
  private __texturesToDeleteAfterUnload: THREE.Texture[];

  public get textureInfos(): InspectorTexturesPluginInfo[] | null {
    return this.__textureInfos;
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.__textureInfos = null;
    this.__texturesToDeleteAfterUnload = [];
  }

  public loadTextureInfos(): void {
    const parser = this.inspector.model?.gltf?.parser;
    if ( !parser ) { return; }

    parser.getDependencies( 'texture' ).then( ( textures: THREE.Texture[] ) => {
      this.__texturesToDeleteAfterUnload.push( ...textures );

      const textureInfos = textures.map( ( texture, iTexture ) => {
        const image = texture.image;

        const iImage: number | undefined
          = parser.json.textures[ iTexture ].extensions?.[ 'KHR_texture_basisu' ]?.source
            ?? parser.json.textures[ iTexture ].source;
        const iBufferView: number | undefined = iImage != null
          ? parser.json.images[ iImage ].bufferView
          : undefined;
        const byteLength: number | undefined = iBufferView != null
          ? parser.json.bufferViews[ iBufferView ].byteLength
          : undefined;

        const promiseBlob = textureToBlob(
          this.inspector.renderer!,
          texture,
          image.width,
          image.height,
        );

        return {
          name: texture.name,
          width: image.width,
          height: image.height,
          mimeType: texture.userData?.mimeType ?? null,
          iTexture,
          iImage,
          iBufferView,
          byteLength,
          image,
          texture,
          promiseBlob,
        };
      } );

      this.__textureInfos = textureInfos;
      this._emit( 'updateTextureInfos', { textureInfos } );
    } );
  }

  public handleAfterUnload(): void {
    this.__textureInfos = null;
    this._emit( 'updateTextureInfos', { textureInfos: null } );

    for ( const textures of this.__texturesToDeleteAfterUnload ) {
      textures.dispose();
    }
  }
}

applyMixins( InspectorTexturesPlugin, [ EventEmittable ] );
