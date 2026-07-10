import * as THREE from 'three';
import * as V1SpringBoneSchema from '@pixiv/types-vrmc-springbone-1.0';
import { HighlighterRuleFunction } from '../Highlighter';
import { VRMSpringBoneJointHelper } from '@pixiv/three-vrm';

const colorConstant = new THREE.Color(1, 0, 1);

export const highlightVRM1SpringBoneSpring: HighlighterRuleFunction = async (
  { index },
  { json, inspector, parser },
) => {
  const indexNum = parseInt(index, 10);

  const springBoneDef = json.extensions!.VRMC_springBone as V1SpringBoneSchema.VRMCSpringBone;
  const springDef = springBoneDef.springs?.[indexNum];
  const nodeIndices = springDef?.joints?.map((joint) => joint.node);
  if (nodeIndices == null || nodeIndices.length < 2) {
    return () => {};
  }

  const helperRoot = inspector.helpersPlugin.springBoneJointHelperRoot;
  const callbacks: (() => void)[] = [];

  const nodes = await Promise.all(
    nodeIndices.map((nodeIndex) => parser.getDependency('node', nodeIndex) as Promise<THREE.Object3D>),
  );

  nodes.slice(0, -1).forEach((node, i) => {
    const childNode = nodes[i + 1];
    const helper = helperRoot.children.find((helperCandidate) => {
      const springBone = (helperCandidate as VRMSpringBoneJointHelper).springBone;
      return springBone.bone === node && springBone.child === childNode;
    }) as VRMSpringBoneJointHelper | undefined;
    if (helper == null) { return; }

    // TODO: setColor
    const line = helper.children[0] as THREE.LineSegments;
    const material = line.material as THREE.LineBasicMaterial;
    const prevColor = material.color.clone();
    material.color.copy(colorConstant);

    callbacks.push(() => {
      material.color.copy(prevColor);
    });
  });

  if (callbacks.length > 0) {
    const prevVisible = helperRoot.visible;
    helperRoot.visible = true;

    callbacks.push(() => {
      helperRoot.visible = prevVisible;
    });
  }

  return () => {
    callbacks.forEach((callback) => callback());
  };
};
