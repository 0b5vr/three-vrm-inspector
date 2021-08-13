import * as THREE from 'three';

/**
 * `mesh.material` can be either `Material` or `Material[]`.
 * It absorbs the difference and executes a function for each materials the mesh has.
 * @param mesh The mesh you want to use
 * @param callback The callback executed for each materials
 */
export function forEachMeshMaterials(
  mesh: THREE.Mesh,
  callback: ( material: THREE.Material ) => void,
): void {
  const set = new Set<THREE.Material>();

  const materialOrMaterials = mesh.material;
  if ( Array.isArray( materialOrMaterials ) ) {
    const materials = materialOrMaterials as THREE.Material[];
    materials.forEach( ( material ) => {
      set.add( material );
    } );
  } else {
    const material = materialOrMaterials as THREE.Material;
    set.add( material );
  }

  for ( const material of set ) {
    callback( material );
  }
}
