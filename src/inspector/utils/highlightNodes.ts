import * as THREE from 'three';
import { genGizmo } from './genGizmo';

/**
 * Highlight specified meshes
 * @param meshes Meshes
 * @returns Call this returning value to undo the highlight
 */
export function highlightNodes(
  nodes: THREE.Object3D[],
): () => void {
  const nodeMeshMap: Map<THREE.Object3D, THREE.Mesh> = new Map();

  nodes.forEach( ( node ) => {
    const mesh = genGizmo();
    node.add( mesh );
    nodeMeshMap.set( node, mesh );
  } );

  return () => {
    nodes.forEach( ( node ) => {
      const mesh = nodeMeshMap.get( node )!;
      node.remove( mesh );
    } );
  };
}
