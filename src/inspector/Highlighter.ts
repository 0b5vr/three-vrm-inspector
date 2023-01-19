import { highlightGLTFMaterial } from './highlighter-functions/highlightGLTFMaterial';
import { highlightGLTFMesh } from './highlighter-functions/highlightGLTFMesh';
import { highlightGLTFMeshTarget } from './highlighter-functions/highlightGLTFMeshTarget';
import { highlightGLTFNode } from './highlighter-functions/highlightGLTFNode';
import { highlightGLTFPrimitive } from './highlighter-functions/highlightGLTFPrimitive';
import { highlightGLTFPrimitiveTarget } from './highlighter-functions/highlightGLTFPrimitiveTarget';
import { highlightGLTFSkin } from './highlighter-functions/highlightGLTFSkin';
import { highlightGLTFSkinJoint } from './highlighter-functions/highlightGLTFSkinJoint';
import { highlightVRM0BlendShapeGroup } from './highlighter-functions/highlightVRM0BlendShapeGroup';
import { highlightVRM0HumanBone } from './highlighter-functions/highlightVRM0HumanBone';
import { highlightVRM0SecondaryAnimationBoneGroup } from './highlighter-functions/highlightVRM0SecondaryAnimationBoneGroup';
import { highlightVRMFirstPersonMeshAnnotation } from './highlighter-functions/highlightVRMFirstPersonMeshAnnotation';
import { highlightVRMLookAtOffset } from './highlighter-functions/highlightVRMLookAtOffset';
import type { GLTF, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';
import type { GLTF as GLTFSchema } from '@gltf-transform/core';
import type { Inspector } from './Inspector';


export interface HighlighterRuleContext {
  inspector: Inspector;
  gltf: GLTF;
  parser: GLTFParser;
  json: GLTFSchema.IGLTF;
}

export type HighlighterRuleFunction
  = ( matches: Record<string, string>, context: HighlighterRuleContext ) => () => void;

export class Highlighter {
  private _inspector: Inspector;
  private _rules: [ string, HighlighterRuleFunction ][];

  public constructor( inspector: Inspector ) {
    this._inspector = inspector;
    this._rules = [
      [ '/nodes/:index', highlightGLTFNode ],
      [ '/meshes/:index', highlightGLTFMesh ],
      [ '/meshes/:meshIndex/primitives/:primIndex', highlightGLTFPrimitive ],
      [ '/meshes/:meshIndex/primitives/:primIndex/targets/:targetIndex', highlightGLTFPrimitiveTarget ],
      [ '/meshes/:meshIndex/primitives/:primIndex/extras/targetNames/:targetIndex', highlightGLTFPrimitiveTarget ],
      [ '/meshes/:meshIndex/extras/targetNames/:targetIndex', highlightGLTFMeshTarget ],
      [ '/skins/:index', highlightGLTFSkin ],
      [ '/skins/:skinIndex/joints/:jointIndex', highlightGLTFSkinJoint ],
      [ '/materials/:index', highlightGLTFMaterial ],
      [ '/extensions/VRM/materialProperties/:index', highlightGLTFMaterial ],
      [ '/extensions/VRM/humanoid/humanBones/:index', highlightVRM0HumanBone ],
      [ '/extensions/VRM/firstPerson/firstPersonBoneOffset', highlightVRMLookAtOffset ],
      [ '/extensions/VRM/firstPerson/meshAnnotations', highlightVRMFirstPersonMeshAnnotation ],
      [ '/extensions/VRM/blendShapeMaster/blendShapeGroups/:index', highlightVRM0BlendShapeGroup ],
      [ '/extensions/VRM/secondaryAnimation/boneGroups/:index', highlightVRM0SecondaryAnimationBoneGroup ],
    ];
  }

  public highlight( path: string ): ( () => void ) | undefined {
    const inspector = this._inspector;
    const pathSplit = path.split( '/' );

    const gltf = inspector.model!.gltf;
    const parser = gltf.parser;
    const json = parser.json as GLTFSchema.IGLTF;

    const context = { inspector, gltf, parser, json };

    let matches: Record<string, string> = {};

    const rule = this._rules.find( ( [ rulePath ] ) => {
      const rulePathSplit = rulePath.split( '/' );
      if ( pathSplit.length !== rulePathSplit.length ) { return false; }

      matches = {};

      return pathSplit.every( ( content, i ) => {
        const ruleContent = rulePathSplit[ i ];

        if ( ruleContent.startsWith( ':' ) ) {
          const key = ruleContent.substring( 1 );
          matches[ key ] = content;
          return true;
        } else {
          return content === ruleContent;
        }
      } );
    } );

    if ( rule != null ) {
      return rule[ 1 ]( matches, context );
    }
  }
}
