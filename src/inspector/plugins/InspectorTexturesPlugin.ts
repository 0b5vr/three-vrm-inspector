import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';

export interface InspectorTexturesPluginInfo {
  name: string;
  width: number;
  height: number;
  mimeType: string | null;
  byteLength: number;
  image: ImageBitmap;
  texture: THREE.Texture;
}

export class InspectorTexturesPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private __textureInfos: InspectorTexturesPluginInfo[] | null;

  public get textureInfos(): InspectorTexturesPluginInfo[] | null {
    return this.__textureInfos;
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.__textureInfos = null;
  }

  public handleAfterLoad(): void {
    const parser = this.inspector.model?.gltf?.parser;
    if ( !parser ) { return; }

    parser.getDependencies( 'texture' ).then( ( textures: THREE.Texture[] ) => {
      this.__textureInfos = textures.map( ( texture, iTexture ) => {
        const image = texture.image;

        const iImage = parser.json.textures[ iTexture ].source;
        const iBufferView = parser.json.images[ iImage ].bufferView;
        const byteLength = parser.json.bufferViews[ iBufferView ].byteLength;

        return {
          name: texture.name,
          width: image.width,
          height: image.height,
          mimeType: texture.userData?.mimeType ?? null,
          byteLength,
          image,
          texture,
        };
      } );
    } );
  }
}
