import { atom } from 'jotai';

export const expressionsAtom = atom<string[] | null>(null);

export const expressionValuesAtom = atom<Record<string, number>>({});
