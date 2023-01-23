import { HighlighterRuleFunction } from '../Highlighter';

export const highlightVRM1Expression: HighlighterRuleFunction = (
  { expressionName },
  { inspector },
) => {
  const prevValue = inspector.model!.vrm!.expressionManager!.getValue( expressionName )!;
  inspector.model!.vrm!.expressionManager!.setValue( expressionName, 1.0 );

  return () => {
    inspector.model!.vrm!.expressionManager!.setValue( expressionName, prevValue );
  };
};
