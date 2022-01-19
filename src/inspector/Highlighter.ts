import * as THREE from 'three';
import * as V0VRM from '@pixiv/types-vrm-0.0';
import { Colors } from '../constants/Colors';
import { Inspector } from './Inspector';
import { VRMSpringBoneJoint, VRMSpringBoneJointHelper } from '@pixiv/three-vrm';
import { genGizmo } from './utils/genGizmo';
import { gltfExtractPrimitivesFromNode } from '../utils/gltfExtractPrimitivesFromNode';
import { highlightMeshes } from './utils/highlightMeshes';
import { highlightNodes } from './utils/highlightNodes';
import { visualizeWeightMaterial } from './utils/visualizeWeightMaterial';
import type { GLTF as GLTFSchema } from '@gltf-transform/core';

const colorConstant = new THREE.Color( Colors.constant );

export class Highlighter {
  private _inspector: Inspector;

  public constructor( inspector: Inspector ) {
    this._inspector = inspector;
  }

  public highlight( path: string ): ( () => void ) | undefined {
    const inspector = this._inspector;
    const pathSplit = path.split( '/' );

    const gltf = inspector.model!.gltf;
    const parser = gltf.parser;
    const json = parser.json as GLTFSchema.IGLTF;

    if (
      pathSplit.length === 3
      && pathSplit[ 1 ] === 'nodes'
    ) {

      const index = parseInt( pathSplit.pop()! );
      let callback: ( () => void ) | undefined;

      parser.getDependency( 'node', index ).then( ( node: THREE.Object3D ) => {
        callback = highlightNodes( [ node ] );
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 3
      && pathSplit[ 1 ] === 'meshes'
    ) {

      const index = parseInt( pathSplit.pop()! );
      let callback: ( () => void ) | undefined;

      const schemaNodes = json.nodes;
      const nodesUsingMesh: number[] = [];
      schemaNodes?.forEach( ( node, nodeIndex ) => {
        if ( node.mesh === index ) {
          nodesUsingMesh.push( nodeIndex );
        }
      } );

      const promisePrimitives = Promise.all( nodesUsingMesh.map( ( nodeIndex ) => {
        return gltfExtractPrimitivesFromNode( gltf, nodeIndex ) as Promise<THREE.Mesh[]>;
      } ) ).then( ( result ) => result.flat() );

      promisePrimitives.then( ( primitives ) => {
        callback = highlightMeshes( primitives );
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 5
      && pathSplit[ 1 ] === 'meshes'
      && pathSplit[ 3 ] === 'primitives'
    ) {

      const meshIndex = parseInt( pathSplit[ 2 ] );
      const primIndex = parseInt( pathSplit[ 4 ] );
      let callback: ( () => void ) | undefined;

      parser.getDependency( 'mesh', meshIndex ).then( ( groupOrMesh: THREE.Mesh | THREE.Group ) => {
        if ( groupOrMesh.children.length !== 0 ) {
          groupOrMesh = groupOrMesh.children[ primIndex ] as THREE.Mesh;
        }
        const mesh = groupOrMesh as THREE.Mesh;

        callback = highlightMeshes( [ mesh ] );
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 7
      && pathSplit[ 1 ] === 'meshes'
      && pathSplit[ 3 ] === 'primitives'
      && pathSplit[ 5 ] === 'targets'
    ) {

      const meshIndex = parseInt( pathSplit[ 2 ] );
      const primIndex = parseInt( pathSplit[ 4 ] );
      const targetIndex = parseInt( pathSplit[ 6 ] );
      let callback: ( () => void ) | undefined;

      parser.getDependency( 'mesh', meshIndex ).then( ( groupOrMesh: THREE.Mesh | THREE.Group ) => {
        if ( groupOrMesh.children.length !== 0 ) {
          groupOrMesh = groupOrMesh.children[ primIndex ] as THREE.Mesh;
        }
        const mesh = groupOrMesh as THREE.Mesh;

        if ( mesh.morphTargetInfluences ) {
          mesh.morphTargetInfluences[ targetIndex ] = 1.0;
        }

        callback = () => {
          if ( mesh.morphTargetInfluences ) {
            mesh.morphTargetInfluences[ targetIndex ] = 0.0;
          }
        };
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 6
      && pathSplit[ 1 ] === 'meshes'
      && pathSplit[ 3 ] === 'extras'
      && pathSplit[ 4 ] === 'targetNames'
    ) {

      const meshIndex = parseInt( pathSplit[ 2 ] );
      const targetIndex = parseInt( pathSplit[ 5 ] );
      let callback: ( () => void ) | undefined;

      const schemaNodes = json.nodes;
      const nodesUsingMesh: number[] = [];
      schemaNodes?.forEach( ( node, nodeIndex ) => {
        if ( node.mesh === meshIndex ) {
          nodesUsingMesh.push( nodeIndex );
        }
      } );

      const promisePrimitives = Promise.all( nodesUsingMesh.map( ( nodeIndex ) => {
        return gltfExtractPrimitivesFromNode( gltf, nodeIndex ) as Promise<THREE.Mesh[]>;
      } ) ).then( ( result ) => result.flat() );

      promisePrimitives.then( ( primitives ) => {
        primitives.forEach( ( primitive ) => {
          if ( primitive.morphTargetInfluences ) {
            primitive.morphTargetInfluences[ targetIndex ] = 1.0;
          }
        } );

        callback = () => {
          primitives.forEach( ( primitive ) => {
            if ( primitive.morphTargetInfluences ) {
              primitive.morphTargetInfluences[ targetIndex ] = 0.0;
            }
          } );
        };
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 3
      && pathSplit[ 1 ] === 'skins'
    ) {

      const skinIndex = parseInt( pathSplit[ 2 ] );
      let callback: ( () => void ) | undefined;

      const schemaNodes = json.nodes;
      const nodesUsingSkin: number[] = [];
      schemaNodes?.forEach( ( node, nodeIndex ) => {
        if ( node.skin === skinIndex ) {
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

    } else if (
      pathSplit.length === 5
      && pathSplit[ 1 ] === 'skins'
      && pathSplit[ 3 ] === 'joints'
    ) {

      const skinIndex = parseInt( pathSplit[ 2 ] );
      const jointIndex = parseInt( pathSplit[ 4 ] );
      const callbacks: ( () => void )[] = [];

      const jointNodeIndex = json.skins![ skinIndex ].joints[ jointIndex ];
      parser.getDependency( 'node', jointNodeIndex ).then( ( node: THREE.Object3D ) => {
        callbacks.push( highlightNodes( [ node ] ) );
      } );

      const schemaNodes = json.nodes;
      const nodesUsingSkin: number[] = [];
      schemaNodes?.forEach( ( node, nodeIndex ) => {
        if ( node.skin === skinIndex ) {
          nodesUsingSkin.push( nodeIndex );
        }
      } );

      const promisePrimitives = Promise.all( nodesUsingSkin.map( ( nodeIndex ) => {
        return gltfExtractPrimitivesFromNode( gltf, nodeIndex ) as Promise<THREE.Mesh[]>;
      } ) ).then( ( result ) => result.flat() );

      promisePrimitives.then( ( primitives ) => {
        callbacks.push( highlightMeshes( primitives, visualizeWeightMaterial ) );
        visualizeWeightMaterial.skinIndexVisualize = jointIndex;
      } );

      return () => {
        callbacks.forEach( ( c ) => c() );
      };

    } else if (
      (
        pathSplit.length === 3
        && pathSplit[ 1 ] === 'materials'
      ) ||
      (
        pathSplit.length === 5
        && pathSplit[ 2 ] === 'VRM'
        && pathSplit[ 3 ] === 'materialProperties'
      )
    ) {

      const index = parseInt( pathSplit.pop()! );
      let callback: ( () => void ) | undefined;

      parser.getDependencies( 'mesh' ).then( ( groups: Array<THREE.Mesh | THREE.Group> ) => {
        const meshes: THREE.Mesh[] = [];

        json.meshes!.forEach( ( schemaMesh, iMesh ) => {
          const primitives = schemaMesh.primitives;
          primitives.forEach( ( schemaPrimitive, iPrimitive ) => {
            if ( index === schemaPrimitive.material ) {
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

    } else if (
      pathSplit.length === 6
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'humanoid'
      && pathSplit[ 4 ] === 'humanBones'
    ) {

      const index = parseInt( path.split( '/' ).pop()! );

      const vrm = json.extensions!.VRM as V0VRM.VRM;
      const boneName = vrm.humanoid!.humanBones![ index ].bone!;
      const bone = inspector.model!.vrm!.humanoid!.getBoneNode( boneName )!;

      return highlightNodes( [ bone ] );

    } else if (
      pathSplit.length === 4
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'firstPerson'
    ) {

      const mesh = genGizmo();
      const lookAt = inspector.model!.vrm!.lookAt!;
      lookAt.getLookAtWorldPosition( mesh.position );
      inspector.scene.add( mesh );

      return () => {
        inspector.scene.remove( mesh );
      };

    } else if (
      pathSplit.length === 5
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'firstPerson'
      && pathSplit[ 4 ] === 'meshAnnotations'
    ) {

      inspector.layerMode = 'firstPerson';

      return () => {
        inspector.layerMode = 'thirdPerson';
      };

    } else if (
      pathSplit.length === 6
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'blendShapeMaster'
      && pathSplit[ 4 ] === 'blendShapeGroups'
    ) {

      const index = parseInt( path.split( '/' ).pop()! );

      const vrm = json.extensions!.VRM as V0VRM.VRM;
      const blendShapeMaster = vrm.blendShapeMaster!;
      const blendShapeName = blendShapeMaster.blendShapeGroups![ index ].name!;

      const prevValue = inspector.model!.vrm!.expressionManager!.getValue( blendShapeName )!;
      inspector.model!.vrm!.expressionManager!.setValue( blendShapeName, 1.0 );

      return () => {
        inspector.model!.vrm!.expressionManager!.setValue( blendShapeName, prevValue );
      };

    } else if (
      pathSplit.length === 6
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'secondaryAnimation'
      && pathSplit[ 4 ] === 'boneGroups'
    ) {

      const index = parseInt( path.split( '/' ).pop()! );

      const vrm = json.extensions!.VRM as V0VRM.VRM;
      const secondaryAnimation = vrm.secondaryAnimation;
      const bones = secondaryAnimation?.boneGroups![ index ].bones;

      const springBoneManager = inspector.model!.vrm!.springBoneManager!;
      const nodeJointMap = new Map<THREE.Object3D, VRMSpringBoneJoint>();
      for ( const springBone of springBoneManager.springBones ) {
        nodeJointMap.set( springBone.bone, springBone );
      }

      const helperRoot = inspector.springBoneJointHelperRoot;
      const jointHelperMap = new Map<VRMSpringBoneJoint, VRMSpringBoneJointHelper>();
      helperRoot.children.forEach( ( child ) => {
        const helper = child as VRMSpringBoneJointHelper;
        jointHelperMap.set( helper.springBone, helper );
      } );

      const callbacks: ( () => void )[] = [];

      const helpers = new Set<VRMSpringBoneJointHelper>();
      bones!.forEach( ( bone ) => {
        parser.getDependency( 'node', bone ).then( ( node: THREE.Object3D ) => {
          node.traverse( ( child ) => {
            const joint = nodeJointMap.get( child )!;
            const helper = jointHelperMap.get( joint )!;
            helpers.add( helper );

            // TODO: setColor
            const line = helper.children[ 0 ] as THREE.LineSegments;
            const material = line.material as THREE.LineBasicMaterial;
            const prevColor = material.color.clone();
            material.color.copy( colorConstant );

            callbacks.push( () => {
              material.color.copy( prevColor );
            } );
          } );
        } );
      } );

      return () => {
        callbacks.forEach( ( callback ) => callback() );
      };
    }
  }
}
