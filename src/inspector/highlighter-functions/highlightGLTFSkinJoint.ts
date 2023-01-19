import * as THREE from 'three';
import { HighlighterRuleFunction } from '../Highlighter';
import { gltfExtractPrimitivesFromNode } from '../../utils/gltfExtractPrimitivesFromNode';
import { highlightNodes } from '../utils/highlightNodes';

export const highlightGLTFSkinJoint: HighlighterRuleFunction = (
  { skinIndex, jointIndex },
  { inspector, gltf, json, parser },
) => {
  const skinIndexNum = parseInt( skinIndex, 10 );
  const jointIndexNum = parseInt( jointIndex, 10 );
  const callbacks: ( () => void )[] = [];

  const jointNodeIndex = json.skins![ skinIndexNum ].joints[ jointIndexNum ];
  parser.getDependency( 'node', jointNodeIndex ).then( ( node: THREE.Object3D ) => {
    callbacks.push( highlightNodes( [ node ] ) );
  } );

  const schemaNodes = json.nodes;
  const nodesUsingSkin: number[] = [];
  schemaNodes?.forEach( ( node, nodeIndex ) => {
    if ( node.skin === skinIndexNum ) {
      nodesUsingSkin.push( nodeIndex );
    }
  } );

  const promisePrimitives = Promise.all( nodesUsingSkin.map( ( nodeIndex ) => {
    return gltfExtractPrimitivesFromNode( gltf, nodeIndex ) as Promise<THREE.Mesh[]>;
  } ) ).then( ( result ) => result.flat() );

  promisePrimitives.then( ( primitives ) => {
    primitives.forEach( ( primitive ) => {
      callbacks.push( inspector.visualizeWeightPlugin.visualize( primitive, jointIndexNum ) );
    } );
  } );

  return () => {
    callbacks.forEach( ( c ) => c() );
  };
};
