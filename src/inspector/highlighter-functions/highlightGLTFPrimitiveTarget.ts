import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';

export const highlightGLTFPrimitiveTarget: HighlighterRuleFunction = async (
  { meshIndex, primIndex, targetIndex },
  { parser },
) => {
  const meshIndexNum = parseInt(meshIndex, 10);
  const primIndexNum = parseInt(primIndex, 10);
  const targetIndexNum = parseInt(targetIndex, 10);

  let groupOrMesh = await parser.getDependency('mesh', meshIndexNum) as THREE.Mesh | THREE.Group;
  if (groupOrMesh.children.length !== 0) {
    groupOrMesh = groupOrMesh.children[primIndexNum] as THREE.Mesh;
  }
  const mesh = groupOrMesh as THREE.Mesh;

  if (mesh.morphTargetInfluences) {
    mesh.morphTargetInfluences[targetIndexNum] = 1.0;
  }

  return () => {
    if (mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[targetIndexNum] = 0.0;
    }
  };
};
