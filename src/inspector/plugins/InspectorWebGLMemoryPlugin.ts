import { applyMixins } from '../../utils/applyMixins';
import { EventEmittable } from '../../utils/EventEmittable';
import type { Inspector } from '../Inspector';
import type { WebGLMemoryExtension } from '../WebGLMemoryExtension';
import type { WebGLMemoryInfo } from '../WebGLMemoryInfo';
import type { InspectorPlugin } from './InspectorPlugin';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
export interface InspectorWebGLMemoryPlugin
  extends EventEmittable<{
    update: { webGLMemoryInfo: WebGLMemoryInfo };
  }> {}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class InspectorWebGLMemoryPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _webglMemoryCache?: WebGLMemoryExtension;

  private get _webglMemory(): WebGLMemoryExtension | null {
    if (this._webglMemoryCache == null) {
      this._webglMemoryCache = this.inspector.renderer
        ?.getContext()
        .getExtension('GMAN_webgl_memory');
    }

    return this._webglMemoryCache ?? null;
  }

  public constructor(inspector: Inspector) {
    this.inspector = inspector;
  }

  public handleBeforeRender(): void {
    const webglMemory = this._webglMemory;
    if (!webglMemory) {
      return;
    }

    const webGLMemoryInfo = webglMemory.getMemoryInfo();
    this._emit('update', { webGLMemoryInfo });
  }
}

applyMixins(InspectorWebGLMemoryPlugin, [EventEmittable]);
