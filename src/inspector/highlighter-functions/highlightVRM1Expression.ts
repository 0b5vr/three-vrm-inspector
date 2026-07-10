import { HighlighterRuleFunction } from '../Highlighter';

export const highlightVRM1Expression: HighlighterRuleFunction = async (
  { expressionName },
  { inspector },
) => {
  const prevValue = inspector.model!.vrm!.expressionManager!.getValue(expressionName)!;
  inspector.model!.vrm!.expressionManager!.setValue(expressionName, 1.0);

  return () => {
    inspector.model!.vrm!.expressionManager!.setValue(expressionName, prevValue);
  };
};
