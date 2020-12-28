import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export async function extractGLTFMesh( gltf: GLTF, index: number ): Promise<THREE.Mesh[]> {
  const meshes: THREE.Mesh[] = [];

  const groupOrMesh = await gltf.parser.getDependency( 'mesh', index );

  if ( ( groupOrMesh as any ).isMesh ) {
    meshes.push( groupOrMesh as THREE.Mesh );
  } else {
    const primitivesCount = gltf.parser.json.meshes[ index ].primitives.length;
    for ( let i = 0; i < primitivesCount; i ++ ) {
      meshes.push( groupOrMesh.children[ i ] as THREE.Mesh );
    }
  }

  return meshes;
}
