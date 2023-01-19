import * as V0VRM from '@pixiv/types-vrm-0.0';
import * as V1VRMSchema from '@pixiv/types-vrmc-vrm-1.0';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightNodes } from '../utils/highlightNodes';

/**
 * A map from old thumb bone names to new thumb bone names
 */
const thumbBoneNameMap: { [key: string]: V1VRMSchema.HumanoidHumanBoneName | undefined } = {
  leftThumbProximal: 'leftThumbMetacarpal',
  leftThumbIntermediate: 'leftThumbProximal',
  rightThumbProximal: 'rightThumbMetacarpal',
  rightThumbIntermediate: 'rightThumbProximal',
};

export const highlightVRM0HumanBone: HighlighterRuleFunction = (
  { index },
  { inspector, json },
) => {
  const indexNum = parseInt( index, 10 );

  const schemaVRM = json.extensions!.VRM as V0VRM.VRM;
  const v0BoneName = schemaVRM.humanoid!.humanBones![ indexNum ].bone!;
  const boneName
    = thumbBoneNameMap[ v0BoneName ] ?? v0BoneName as V1VRMSchema.HumanoidHumanBoneName;

  const humanoid = inspector.model!.vrm!.humanoid!;
  const bone = humanoid.getRawBoneNode( boneName )!;

  return highlightNodes( [ bone ] );
};
