import * as THREE from 'three';
import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';
import { MeshVisualizeWeightMaterial } from '../utils/MeshVisualizeWeightMaterial';
import { highlightMeshes } from '../utils/highlightMeshes';

export class InspectorVisualizeWeightPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public constructor(inspector: Inspector) {
    this.inspector = inspector;
  }

  public visualize(mesh: THREE.Mesh, jointIndex: number): () => void {
    if (!(mesh instanceof THREE.SkinnedMesh)) { return () => 0; }

    const visualizeWeightMaterial = new MeshVisualizeWeightMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    visualizeWeightMaterial.skinIndexVisualize = jointIndex;

    const undo = highlightMeshes([mesh], visualizeWeightMaterial);

    return () => {
      undo();
      visualizeWeightMaterial.dispose();
    };
  }
}
