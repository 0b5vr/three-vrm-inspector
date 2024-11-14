import { InspectorStatsPluginStats } from '../../inspector/plugins/InspectorStatsPlugin';
import { atom } from 'jotai';

export const statsAtom = atom<InspectorStatsPluginStats | null>( null );
