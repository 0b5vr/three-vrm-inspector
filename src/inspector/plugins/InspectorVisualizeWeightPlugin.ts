import * as THREE from 'three';
import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';
import { MeshVisualizeWeightMaterial } from '../utils/MeshVisualizeWeightMaterial';
import { highlightMeshes } from '../utils/highlightMeshes';

export class InspectorVisualizeWeightPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public boneIndexMap?: Map<THREE.Skeleton, Map<number, number>>;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;
  }

  public visualize( mesh: THREE.Mesh, jointIndex: number ): () => void {
    if ( !( mesh instanceof THREE.SkinnedMesh ) ) { return () => 0; }

    const map = this.boneIndexMap!.get( mesh.skeleton )!;
    const newJointIndex = map.get( jointIndex )!;

    const visualizeWeightMaterial = new MeshVisualizeWeightMaterial( {
      transparent: true,
      depthTest: false,
      depthWrite: false,
    } );
    visualizeWeightMaterial.skinIndexVisualize = newJointIndex;

    const undo = highlightMeshes( [ mesh ], visualizeWeightMaterial );

    return () => {
      undo();
      visualizeWeightMaterial.dispose();
    };
  }
}
