import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { gltfExtractPrimitivesFromNode } from '../../utils/gltfExtractPrimitivesFromNode';

export const highlightGLTFMeshTarget: HighlighterRuleFunction = async (
  { meshIndex, targetIndex },
  { gltf, json },
) => {
  const meshIndexNum = parseInt(meshIndex, 10);
  const targetIndexNum = parseInt(targetIndex, 10);

  const schemaNodes = json.nodes;
  const nodesUsingMesh: number[] = [];
  schemaNodes?.forEach((node, nodeIndex) => {
    if (node.mesh === meshIndexNum) {
      nodesUsingMesh.push(nodeIndex);
    }
  });

  const primitives = await Promise.all(nodesUsingMesh.map((nodeIndex) => {
    return gltfExtractPrimitivesFromNode(gltf, nodeIndex) as Promise<THREE.Mesh[]>;
  })).then((result) => result.flat());

  primitives.forEach((primitive) => {
    if (primitive.morphTargetInfluences) {
      primitive.morphTargetInfluences[targetIndexNum] = 1.0;
    }
  });

  return () => {
    primitives.forEach((primitive) => {
      if (primitive.morphTargetInfluences) {
        primitive.morphTargetInfluences[targetIndexNum] = 0.0;
      }
    });
  };
};
