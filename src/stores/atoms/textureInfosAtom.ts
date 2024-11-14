import { atom } from 'jotai';
import type { InspectorTexturesPluginInfo } from '../../inspector/plugins/InspectorTexturesPlugin';

export const textureInfosAtom = atom<InspectorTexturesPluginInfo[] | null>( null );
