import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { gltfExtractPrimitivesFromNode } from '../../utils/gltfExtractPrimitivesFromNode';
import { highlightMeshes } from '../utils/highlightMeshes';

export const highlightGLTFSkin: HighlighterRuleFunction = (
  { index },
  { gltf, json },
) => {
  const indexNum = parseInt( index, 10 );
  let callback: ( () => void ) | undefined;

  const schemaNodes = json.nodes;
  const nodesUsingSkin: number[] = [];
  schemaNodes?.forEach( ( node, nodeIndex ) => {
    if ( node.skin === indexNum ) {
      nodesUsingSkin.push( nodeIndex );
    }
  } );

  const promisePrimitives = Promise.all( nodesUsingSkin.map( ( nodeIndex ) => {
    return gltfExtractPrimitivesFromNode( gltf, nodeIndex ) as Promise<THREE.Mesh[]>;
  } ) ).then( ( result ) => result.flat() );

  promisePrimitives.then( ( primitives ) => {
    callback = highlightMeshes( primitives );
  } );

  return () => {
    callback && callback();
  };
};
