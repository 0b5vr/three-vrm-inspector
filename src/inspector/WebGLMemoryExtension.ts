import type { WebGLMemoryInfo } from './WebGLMemoryInfo';

export interface WebGLMemoryExtension {
  getMemoryInfo(): WebGLMemoryInfo;
}
