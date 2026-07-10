import * as THREE from 'three';
import * as V1SpringBoneSchema from '@pixiv/types-vrmc-springbone-1.0';
import { VRMSpringBoneColliderHelper } from '@pixiv/three-vrm';
import { HighlighterRuleFunction } from '../Highlighter';

const colorConstant = new THREE.Color(0, 1, 1);

function highlightColliderHelpers(
  helperRoot: THREE.Group,
  colliderIndices: number[],
): () => void {
  const callbacks: (() => void)[] = [];

  new Set(colliderIndices).forEach((colliderIndex) => {
    const helper = helperRoot.children[colliderIndex] as VRMSpringBoneColliderHelper | undefined;
    if (helper == null) { return; }

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
}

export const highlightVRM1SpringBoneCollider: HighlighterRuleFunction = async (
  { index },
  { json, inspector },
) => {
  const indexNum = parseInt(index, 10);
  const springBoneDef = json.extensions!.VRMC_springBone as V1SpringBoneSchema.VRMCSpringBone;

  if (springBoneDef.colliders?.[indexNum] == null) {
    return () => {};
  }

  return highlightColliderHelpers(
    inspector.helpersPlugin.springBoneColliderHelperRoot,
    [indexNum],
  );
};

export const highlightVRM1SpringBoneColliderGroup: HighlighterRuleFunction = async (
  { index },
  { json, inspector },
) => {
  const indexNum = parseInt(index, 10);
  const springBoneDef = json.extensions!.VRMC_springBone as V1SpringBoneSchema.VRMCSpringBone;
  const colliderIndices = springBoneDef.colliderGroups?.[indexNum]?.colliders;
  if (colliderIndices == null) {
    return () => {};
  }

  return highlightColliderHelpers(
    inspector.helpersPlugin.springBoneColliderHelperRoot,
    colliderIndices,
  );
};
