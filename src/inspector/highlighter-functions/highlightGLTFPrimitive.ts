import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightMeshes } from '../utils/highlightMeshes';

export const highlightGLTFPrimitive: HighlighterRuleFunction = (
  { meshIndex, primIndex },
  { parser },
) => {
  const meshIndexNum = parseInt( meshIndex, 10 );
  const primIndexNum = parseInt( primIndex, 10 );
  let callback: ( () => void ) | undefined;

  parser.getDependency( 'mesh', meshIndexNum ).then( ( groupOrMesh: THREE.Mesh | THREE.Group ) => {
    if ( groupOrMesh.children.length !== 0 ) {
      groupOrMesh = groupOrMesh.children[ primIndexNum ] as THREE.Mesh;
    }
    const mesh = groupOrMesh as THREE.Mesh;

    callback = highlightMeshes( [ mesh ] );
  } );

  return () => {
    callback && callback();
  };
};
