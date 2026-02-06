import type { VRMExpressionPresetName } from '@pixiv/three-vrm';
import { useContext } from 'react';
import { InspectorContext } from '../InspectorContext';
import { ExpressionRow } from './ExpressionRow';
import { Hr } from './Hr';
import { Pane, type PaneParams } from './Pane';
import { PaneRoot } from './PaneRoot';

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
  const { inspector } = useContext(InspectorContext);

  const expressionManager = inspector.model?.vrm?.expressionManager;
  const expressionMap = expressionManager?.expressionMap;

  const customNames: string[] = [];
  if (expressionMap) {
    Array.from(Object.keys(expressionMap)).forEach((name) => {
      if (!presetSet.has(name)) {
        customNames.push(name);
      }
    });
  }

  const hasUnknowns = (customNames?.length ?? 0) >= 1;

  return (
    <Pane {...params}>
      <PaneRoot>
        {expressionManager ? (
          <>
            {presets.map((name) => (
              <ExpressionRow
                key={name}
                name={name}
                isAvailable={expressionManager?.getExpression(name) != null}
              />
            ))}
            <Hr />
            {customNames?.map((name) => (
              <ExpressionRow key={name} name={name} isAvailable={true} />
            ))}
            {!hasUnknowns && (
              <span className="text-gray-500">(No custom expressions)</span>
            )}
          </>
        ) : (
          'No Expressions / BlendShapeProxy detected.'
        )}
      </PaneRoot>
    </Pane>
  );
}
