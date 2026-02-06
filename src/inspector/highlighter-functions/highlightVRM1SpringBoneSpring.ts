import type {
  VRMSpringBoneJoint,
  VRMSpringBoneJointHelper,
} from '@pixiv/three-vrm';
import type * as V1SpringBoneSchema from '@pixiv/types-vrmc-springbone-1.0';
import * as THREE from 'three';
import { Colors } from '../../constants/Colors';
import type { HighlighterRuleFunction } from '../Highlighter';

const colorConstant = new THREE.Color(Colors.constant);

export const highlightVRM1SpringBoneSpring: HighlighterRuleFunction = (
  { index },
  { json, inspector, parser },
) => {
  const indexNum = parseInt(index, 10);

  const springBoneManager = inspector.model!.vrm!.springBoneManager!;
  const nodeJointMap = new Map<THREE.Object3D, VRMSpringBoneJoint>();
  for (const joint of springBoneManager.joints) {
    nodeJointMap.set(joint.bone, joint);
  }

  const helperRoot = inspector.helpersPlugin.springBoneJointHelperRoot;
  const jointHelperMap = new Map<
    VRMSpringBoneJoint,
    VRMSpringBoneJointHelper
  >();
  helperRoot.children.forEach((child) => {
    const helper = child as VRMSpringBoneJointHelper;
    jointHelperMap.set(helper.springBone, helper);
  });

  const callbacks: (() => void)[] = [];

  const springBoneDef = json.extensions!
    .VRMC_springBone as V1SpringBoneSchema.VRMCSpringBone;
  const springDef = springBoneDef.springs![indexNum];
  const nodeIndices = springDef.joints.map((joint) => joint.node);

  const helpers = new Set<VRMSpringBoneJointHelper>();
  for (const nodeIndex of nodeIndices) {
    parser.getDependency('node', nodeIndex).then((node: THREE.Object3D) => {
      const joint = nodeJointMap.get(node);
      if (joint == null) {
        return;
      }

      const helper = jointHelperMap.get(joint);
      if (helper == null) {
        // since the last joint does not have actual joint this happens very often
        return;
      }

      helpers.add(helper);

      // TODO: setColor
      const line = helper.children[0] as THREE.LineSegments;
      const material = line.material as THREE.LineBasicMaterial;
      const prevColor = material.color.clone();
      material.color.copy(colorConstant);

      callbacks.push(() => {
        material.color.copy(prevColor);
      });
    });
  }

  return () => {
    for (const callback of callbacks) {
      callback();
    }
  };
};
