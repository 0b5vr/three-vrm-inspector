import * as V0VRM from '@pixiv/types-vrm-0.0';
import * as V1VRMSchema from '@pixiv/types-vrmc-vrm-1.0';
import { HighlighterRuleFunction } from '../Highlighter';

/**
 * A map from old blend shape proxy names to new expression names
 */
const expressionNameMap: {
  [key in V0VRM.BlendShapePresetName]?: V1VRMSchema.ExpressionPresetName | undefined
} = {
  neutral: 'neutral',
  joy: 'happy',
  sorrow: 'sad',
  angry: 'angry',
  fun: 'relaxed',
  a: 'aa',
  e: 'ee',
  i: 'ih',
  o: 'oh',
  u: 'ou',
  blink: 'blink',
  blink_l: 'blinkLeft',
  blink_r: 'blinkRight',
  lookdown: 'lookDown',
  lookleft: 'lookLeft',
  lookright: 'lookRight',
  lookup: 'lookUp',
};

export const highlightVRM0BlendShapeGroup: HighlighterRuleFunction = (
  { index },
  { json, inspector },
) => {
  const indexNum = parseInt( index, 10 );

  const vrm = json.extensions!.VRM as V0VRM.VRM;
  const blendShapeMaster = vrm.blendShapeMaster!;
  const blendShapeGroup = blendShapeMaster.blendShapeGroups![ indexNum ];
  const v0BlendShapePresetName = blendShapeGroup.presetName;
  const name = blendShapeGroup.name!;
  const expressionName = v0BlendShapePresetName != null
    ? expressionNameMap[ v0BlendShapePresetName ] ?? name
    : name;

  const prevValue = inspector.model!.vrm!.expressionManager!.getValue( expressionName )!;
  inspector.model!.vrm!.expressionManager!.setValue( expressionName, 1.0 );

  return () => {
    inspector.model!.vrm!.expressionManager!.setValue( expressionName, prevValue );
  };
};
