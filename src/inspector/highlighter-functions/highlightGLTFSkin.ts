import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { gltfExtractPrimitivesFromNode } from '../../utils/gltfExtractPrimitivesFromNode';
import { highlightMeshes } from '../utils/highlightMeshes';

export const highlightGLTFSkin: HighlighterRuleFunction = async (
  { index },
  { gltf, json },
) => {
  const indexNum = parseInt(index, 10);

  const schemaNodes = json.nodes;
  const nodesUsingSkin: number[] = [];
  schemaNodes?.forEach((node, nodeIndex) => {
    if (node.skin === indexNum) {
      nodesUsingSkin.push(nodeIndex);
    }
  });

  const primitives = await Promise.all(nodesUsingSkin.map((nodeIndex) => {
    return gltfExtractPrimitivesFromNode(gltf, nodeIndex) as Promise<THREE.Mesh[]>;
  })).then((result) => result.flat());

  const callback = highlightMeshes(primitives);

  return () => {
    callback();
  };
};
