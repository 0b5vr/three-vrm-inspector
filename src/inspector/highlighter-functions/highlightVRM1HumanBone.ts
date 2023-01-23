import * as V1VRMSchema from '@pixiv/types-vrmc-vrm-1.0';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightNodes } from '../utils/highlightNodes';

export const highlightVRM1HumanBone: HighlighterRuleFunction = (
  { boneName },
  { inspector },
) => {
  const humanoid = inspector.model!.vrm!.humanoid!;
  const bone = humanoid.getRawBoneNode( boneName as V1VRMSchema.HumanoidHumanBoneName )!;

  return highlightNodes( [ bone ] );
};
