import * as THREE from 'three';
import { GLTFSchema, VRMSchema, VRMSpringBoneDebug } from '@pixiv/three-vrm';
import { Colors } from '../constants/Colors';
import { Inspector } from './Inspector';
import { genGizmo } from './utils/genGizmo';
import { gltfExtractPrimitivesFromNode } from '../utils/gltfExtractPrimitivesFromNode';
import { highlightMeshes } from './utils/highlightMeshes';
import { highlightNodes } from './utils/highlightNodes';
import { visualizeWeightMaterial } from './utils/visualizeWeightMaterial';

const colorConstant = new THREE.Color( Colors.constant );

export class Highlighter {
  private _inspector: Inspector;

  public constructor( inspector: Inspector ) {
    this._inspector = inspector;
  }

  public highlight( path: string ): ( () => void ) | undefined {
    const inspector = this._inspector;
    const pathSplit = path.split( '/' );

    if (
      pathSplit.length === 3
      && pathSplit[ 1 ] === 'nodes'
    ) {

      const index = parseInt( pathSplit.pop()! );
      let callback: ( () => void ) | undefined;

      const parser = inspector.gltf!.parser;
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

      const gltf = inspector.gltf!;
      const schemaNodes: any[] = gltf.parser.json.nodes;
      const nodesUsingMesh: number[] = [];
      schemaNodes.forEach( ( node, nodeIndex ) => {
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

      const parser = inspector.gltf!.parser;
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

      const parser = inspector.gltf!.parser;
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

      const gltf = inspector.gltf!;
      const schemaNodes: any[] = gltf.parser.json.nodes;
      const nodesUsingMesh: number[] = [];
      schemaNodes.forEach( ( node, nodeIndex ) => {
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

      const gltf = inspector.gltf!;
      const schemaNodes: any[] = gltf.parser.json.nodes;
      const nodesUsingSkin: number[] = [];
      schemaNodes.forEach( ( node, nodeIndex ) => {
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

      const gltf = inspector.gltf!;

      const jointNodeIndex: any = gltf.parser.json.skins[ skinIndex ].joints[ jointIndex ];
      gltf.parser.getDependency( 'node', jointNodeIndex ).then( ( node: THREE.Object3D ) => {
        callbacks.push( highlightNodes( [ node ] ) );
      } );

      const schemaNodes: any[] = gltf.parser.json.nodes;
      const nodesUsingSkin: number[] = [];
      schemaNodes.forEach( ( node, nodeIndex ) => {
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

      const parser = inspector.gltf!.parser;
      parser.getDependencies( 'mesh' ).then( ( groups: Array<THREE.Mesh | THREE.Group> ) => {
        const meshes: THREE.Mesh[] = [];

        const gltf = parser.json as GLTFSchema.GLTF;
        gltf.meshes!.forEach( ( schemaMesh, iMesh ) => {
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

      const parser = inspector.gltf!.parser;
      const gltf = parser.json as GLTFSchema.GLTF;
      const vrm = gltf.extensions!.VRM as VRMSchema.VRM;
      const boneName = vrm.humanoid!.humanBones![ index ].bone!;
      const bones = inspector.vrm!.humanoid!.getBoneNodes( boneName );

      return highlightNodes( bones );

    } else if (
      pathSplit.length === 4
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'firstPerson'
    ) {

      const mesh = genGizmo();
      const firstPerson = inspector.vrm!.firstPerson!;
      firstPerson.getFirstPersonWorldPosition( mesh.position );
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

      const parser = inspector.gltf!.parser;
      const gltf = parser.json as GLTFSchema.GLTF;
      const vrm = gltf.extensions!.VRM as VRMSchema.VRM;
      const blendShapeMaster: VRMSchema.BlendShape = vrm.blendShapeMaster!;
      const blendShapeName = blendShapeMaster.blendShapeGroups![ index ].name!;

      const prevValue = inspector.vrm!.blendShapeProxy!.getValue( blendShapeName )!;
      inspector.vrm!.blendShapeProxy!.setValue( blendShapeName, 1.0 );

      return () => {
        inspector.vrm!.blendShapeProxy!.setValue( blendShapeName, prevValue );
      };

    } else if (
      pathSplit.length === 6
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'secondaryAnimation'
      && pathSplit[ 4 ] === 'boneGroups'
    ) {

      const index = parseInt( path.split( '/' ).pop()! );
      const springBoneManager = inspector.vrm!.springBoneManager!;
      const springBoneGroup
        = springBoneManager.springBoneGroupList[ index ] as VRMSpringBoneDebug[];

      const gizmoColorMap = new Map<THREE.ArrowHelper, THREE.Color>();
      springBoneGroup.forEach( ( springBone ) => {
        const gizmo = springBone.getGizmo();
        const prevColor = ( gizmo.line.material as THREE.LineBasicMaterial ).color.clone();
        gizmoColorMap.set( gizmo, prevColor );
        gizmo.setColor( colorConstant );
      } );

      return () => {
        springBoneGroup.forEach( ( springBone ) => {
          const gizmo = springBone.getGizmo();
          const color = gizmoColorMap.get( gizmo )!;
          gizmo.setColor( color );
        } );
      };

    }
  }
}
