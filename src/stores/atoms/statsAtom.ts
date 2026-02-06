import { atom } from 'jotai';
import type { InspectorStatsPluginStats } from '../../inspector/plugins/InspectorStatsPlugin';

export const statsAtom = atom<InspectorStatsPluginStats | null>(null);
