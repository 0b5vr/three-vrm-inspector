import { ExpressionRow } from './ExpressionRow';
import { Hr } from './Hr';
import { Pane, PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';
import { expressionsAtom } from '../stores/atoms/expressionsAtom';
import { VRMExpressionPresetName } from '@pixiv/three-vrm';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

// == constants ====================================================================================
const presets: VRMExpressionPresetName[] = [
  'neutral',
  'happy',
  'angry',
  'sad',
  'relaxed',
  'surprised',
  'blink',
  'blinkLeft',
  'blinkRight',
  'aa',
  'ee',
  'ih',
  'oh',
  'ou',
  'lookLeft',
  'lookRight',
  'lookDown',
  'lookUp',
];
const presetSet: Set<string> = new Set(presets);

// == element ======================================================================================
export function ExpressionsPane(params: PaneParams) {
  const expressions = useAtomValue(expressionsAtom);
  const expressionsSet = useMemo(() => new Set(expressions ?? []), [expressions]);
  const customNames = expressions == null
    ? []
    : expressions.filter((name) => !presetSet.has(name));
  const hasCustomExpressions = customNames.length >= 1;

  return (
    <Pane {...params}>
      <PaneRoot className="h-80 overflow-y-scroll resize-y pr-1">
        {expressions && (
          <>
            {presets.map((name) => (
              <ExpressionRow
                key={name}
                name={name}
                isAvailable={expressionsSet.has(name)}
              />
            ))}
            <Hr />
            {customNames.map((name) => (
              <ExpressionRow
                key={name}
                name={name}
                isAvailable={true}
              />
            ))}
            {!hasCustomExpressions && <span className="text-gray-500">(No custom expressions)</span>}
          </>
        )}
        {!expressions && 'No Expressions / BlendShapeProxy detected.'}
      </PaneRoot>
    </Pane>
  );
}
