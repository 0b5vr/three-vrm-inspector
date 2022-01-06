import * as THREE from 'three';

const highlightMaterial = new THREE.MeshNormalMaterial( {
  transparent: true,
  depthTest: false,
  depthWrite: false,
} );

/**
 * Highlight specified meshes
 * @param meshes Meshes
 * @returns Call this returning value to undo the highlight
 */
export function highlightMeshes(
  meshes: THREE.Mesh[],
  material: THREE.Material = highlightMaterial,
): () => void {
  const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();

  meshes.forEach( ( mesh ) => {
    if ( Array.isArray( mesh.material ) ) {
      meshMaterialMap.set( mesh, mesh.material[ 0 ] );
      mesh.material[ 0 ] = material;
    }
  } );

  return (): void => {
    for ( const [ mesh, mtl ] of meshMaterialMap ) {
      ( mesh.material as THREE.Material[] )[ 0 ] = mtl;
    }
  };
}
