import { EventEmittable } from '../../utils/EventEmittable';
import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';
import { WebGLMemoryExtension } from '../WebGLMemoryExtension';
import { WebGLMemoryInfo } from '../WebGLMemoryInfo';
import { applyMixins } from '../../utils/applyMixins';

export interface InspectorWebGLMemoryPlugin extends EventEmittable<{
  update: { webGLMemoryInfo: WebGLMemoryInfo };
}> {}
export class InspectorWebGLMemoryPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _webglMemoryCache?: WebGLMemoryExtension;

  private get _webglMemory(): WebGLMemoryExtension | null {
    if ( this._webglMemoryCache == null ) {
      this._webglMemoryCache = this.inspector.renderer?.getContext().getExtension( 'GMAN_webgl_memory' );
    }

    return this._webglMemoryCache ?? null;
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;
  }

  public handleBeforeRender(): void {
    const webglMemory = this._webglMemory;
    if ( !webglMemory ) { return; }

    const webGLMemoryInfo = webglMemory.getMemoryInfo();
    this._emit( 'update', { webGLMemoryInfo } );
  }
}

applyMixins( InspectorWebGLMemoryPlugin, [ EventEmittable ] );
