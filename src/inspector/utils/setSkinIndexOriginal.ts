import * as THREE from 'three';

export const SKIN_INDEX_ORIGINAL_ATTRIBUTE_NAME = 'skinIndexOriginal';

export function setSkinIndexOriginal(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (!(object as THREE.SkinnedMesh).isSkinnedMesh) {
      return;
    }

    const mesh = object as THREE.SkinnedMesh;
    const skinIndex = mesh.geometry.getAttribute('skinIndex');
    mesh.geometry.setAttribute(SKIN_INDEX_ORIGINAL_ATTRIBUTE_NAME, skinIndex.clone());
  });
}
