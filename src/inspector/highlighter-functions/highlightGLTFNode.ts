import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { highlightNodes } from '../utils/highlightNodes';

export const highlightGLTFNode: HighlighterRuleFunction = ( { index }, { parser } ) => {
  const indexNum = parseInt( index, 10 );
  let callback: ( () => void ) | undefined;

  parser.getDependency( 'node', indexNum ).then( ( node: THREE.Object3D ) => {
    callback = highlightNodes( [ node ] );
  } );

  return () => {
    callback && callback();
  };
};
