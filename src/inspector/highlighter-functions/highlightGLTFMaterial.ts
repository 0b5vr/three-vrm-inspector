import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightMeshes } from '../utils/highlightMeshes';

export const highlightGLTFMaterial: HighlighterRuleFunction = (
  { index },
  { json, parser },
) => {
  const indexNum = parseInt( index, 10 );
  let callback: ( () => void ) | undefined;

  parser.getDependencies( 'mesh' ).then( ( groups: Array<THREE.Mesh | THREE.Group> ) => {
    const meshes: THREE.Mesh[] = [];

    json.meshes!.forEach( ( schemaMesh, iMesh ) => {
      const primitives = schemaMesh.primitives;
      primitives.forEach( ( schemaPrimitive, iPrimitive ) => {
        if ( indexNum === schemaPrimitive.material ) {
          let groupOrMesh = groups[ iMesh ];
          if ( groupOrMesh.children.length !== 0 ) {
            groupOrMesh = groupOrMesh.children[ iPrimitive ] as THREE.Mesh;
          }
          const mesh = groupOrMesh as THREE.Mesh;

          meshes.push( mesh );
        }
      } );
    } );

    callback = highlightMeshes( meshes );
  } );

  return () => {
    callback && callback();
  };
};
