import { WebGLMemoryInfo } from '../../inspector/WebGLMemoryInfo';
import { atom } from 'jotai';

export const webglMemoryInfoAtom = atom<WebGLMemoryInfo | null>( null );
