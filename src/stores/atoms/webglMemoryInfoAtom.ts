import { atom } from 'jotai';
import type { WebGLMemoryInfo } from '../../inspector/WebGLMemoryInfo';

export const webglMemoryInfoAtom = atom<WebGLMemoryInfo | null>(null);
