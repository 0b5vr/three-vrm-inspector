import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { gltfExtractPrimitivesFromNode } from '../../utils/gltfExtractPrimitivesFromNode';
import { highlightMeshes } from '../utils/highlightMeshes';

function createBoxFromMeshes(meshes: THREE.Mesh[]): THREE.Box3 {
  const box = new THREE.Box3();
  for (const mesh of meshes) {
    box.expandByObject(mesh);
  }
  return box;
}

function highlightBox(box: THREE.Box3, scene: THREE.Scene): () => void {
  const boxHelper = new THREE.Box3Helper(box, '#ff0000');
  scene.add(boxHelper);

  return () => {
    scene.remove(boxHelper);
    boxHelper.dispose();
  };
}

export const highlightGLTFMesh: HighlighterRuleFunction = async (
  { index },
  { gltf, json, inspector },
) => {
  const indexNum = parseInt(index, 10);

  const schemaNodes = json.nodes;
  const nodesUsingMesh: number[] = [];
  schemaNodes?.forEach((node, nodeIndex) => {
    if (node.mesh === indexNum) {
      nodesUsingMesh.push(nodeIndex);
    }
  });

  const primitives = await Promise.all(nodesUsingMesh.map((nodeIndex) => {
    return gltfExtractPrimitivesFromNode(gltf, nodeIndex) as Promise<THREE.Mesh[]>;
  })).then((result) => result.flat());

  const callbackMeshes = highlightMeshes(primitives);
  const callbackBox = highlightBox(createBoxFromMeshes(primitives), inspector.scene);

  const callback = () => {
    callbackMeshes();
    callbackBox();
  };

  return () => {
    callback?.();
  };
};
