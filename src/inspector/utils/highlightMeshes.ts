import { MToonMaterial } from '@pixiv/three-vrm';
import * as THREE from 'three';

function isMToonOutline(material: THREE.Material): boolean {
  if (!('isMToonMaterial' in material)) { return false; }
  const mToon = material as MToonMaterial;
  return mToon.isOutline;
}

const invisibleMaterial = new THREE.MeshBasicMaterial({
  visible: false,
});

const highlightMaterial = new THREE.MeshNormalMaterial({
  transparent: true,
  depthTest: false,
  depthWrite: false,
});

/**
 * Highlight specified meshes
 * @param meshes Meshes
 * @returns Call this returning value to undo the highlight
 */
export function highlightMeshes(
  meshes: THREE.Mesh[],
  material: THREE.Material = highlightMaterial,
): () => void {
  const meshMaterialMap: Map<THREE.Mesh, THREE.Material | THREE.Material[]> = new Map();

  for (const mesh of meshes) {
    if (Array.isArray(mesh.material)) {
      meshMaterialMap.set(mesh, mesh.material.concat());
      for (let i = 0; i < mesh.material.length; i++) {
        if (isMToonOutline(mesh.material[i])) {
          mesh.material[i] = invisibleMaterial;
        } else {
          mesh.material[i] = material;
        }
      }
    } else {
      meshMaterialMap.set(mesh, mesh.material);
      if (isMToonOutline(mesh.material)) {
        (mesh.material as THREE.Material) = invisibleMaterial;
      } else {
        (mesh.material as THREE.Material) = material;
      }
    }
  }

  return (): void => {
    for (const [mesh, materialOrMaterials] of meshMaterialMap) {
      mesh.material = materialOrMaterials;
    }
  };
}
