import * as THREE from 'three';
import * as V0VRM from '@pixiv/types-vrm-0.0';
import { VRMSpringBoneJoint, VRMSpringBoneJointHelper } from '@pixiv/three-vrm';
import { Colors } from '../constants/Colors';
import { Inspector } from './Inspector';
import { gltfExtractPrimitivesFromNode } from '../utils/gltfExtractPrimitivesFromNode';

const colorConstant = new THREE.Color( Colors.constant );

const highlightMaterial = new THREE.MeshNormalMaterial( {
  transparent: true,
  skinning: true,
  morphTargets: true,
  morphNormals: true,
  depthTest: false,
  depthWrite: false
} );

const highlightWireframeMaterial = new THREE.MeshBasicMaterial( {
  color: colorConstant,
  transparent: true,
  wireframe: true,
  depthTest: false,
  depthWrite: false
} );

const highlightSphereGeometry = new THREE.SphereBufferGeometry( 0.2 );

function genGizmo( geom: THREE.BufferGeometry ): THREE.Mesh {
  const mesh = new THREE.Mesh( geom, highlightWireframeMaterial );
  mesh.frustumCulled = false;
  mesh.renderOrder = 10000;
  return mesh;
}

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
      parser.getDependency( 'node', index ).then( ( node ) => {
        const mesh = genGizmo( highlightSphereGeometry );
        node.add( mesh );

        callback = () => {
          node.remove( mesh );
        };
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 3
      && pathSplit[ 1 ] === 'meshes'
    ) {

      const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
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
        primitives.forEach( ( primitive ) => {
          if ( Array.isArray( primitive.material ) ) {
            meshMaterialMap.set( primitive, primitive.material[ 0 ] );
            primitive.material[ 0 ] = highlightMaterial;
          }
        } );

        callback = () => {
          for ( const [ mesh, mtl ] of meshMaterialMap ) {
            ( mesh.material as THREE.Material[] )[ 0 ] = mtl;
          }
        };
      } );

      return () => {
        callback && callback();
      };

    } else if (
      pathSplit.length === 5
      && pathSplit[ 1 ] === 'meshes'
      && pathSplit[ 3 ] === 'primitives'
    ) {

      const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
      const meshIndex = parseInt( pathSplit[ 2 ] );
      const primIndex = parseInt( pathSplit[ 4 ] );
      let callback: ( () => void ) | undefined;

      const parser = inspector.gltf!.parser;
      parser.getDependency( 'mesh', meshIndex ).then( ( groupOrMesh: THREE.Mesh | THREE.Group ) => {
        if ( groupOrMesh.children.length !== 0 ) {
          groupOrMesh = groupOrMesh.children[ primIndex ] as THREE.Mesh;
        }
        const mesh = groupOrMesh as THREE.Mesh;

        if ( Array.isArray( mesh.material ) ) {
          meshMaterialMap.set( mesh, mesh.material[ 0 ] );
          mesh.material[ 0 ] = highlightMaterial;
        }

        callback = () => {
          for ( const [ mesh, mtl ] of meshMaterialMap ) {
            ( mesh.material as THREE.Material[] )[ 0 ] = mtl;
          }
        };
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

      const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
      const index = parseInt( pathSplit.pop()! );
      let callback: ( () => void ) | undefined;

      const parser = inspector.gltf!.parser;
      parser.getDependencies( 'mesh' ).then( ( groups: Array<THREE.Mesh | THREE.Group> ) => {
        const gltf = parser.json;
        ( gltf.meshes! as any[] ).forEach( ( schemaMesh, iMesh ) => {
          const primitives = schemaMesh.primitives;
          ( primitives as any[] ).forEach( ( schemaPrimitive, iPrimitive ) => {
            if ( index === schemaPrimitive.material ) {
              let groupOrMesh = groups[ iMesh ];
              if ( groupOrMesh.children.length !== 0 ) {
                groupOrMesh = groupOrMesh.children[ iPrimitive ] as THREE.Mesh;
              }
              const mesh = groupOrMesh as THREE.Mesh;

              if ( Array.isArray( mesh.material ) ) {
                meshMaterialMap.set( mesh, mesh.material[ 0 ] );
                mesh.material[ 0 ] = highlightMaterial;
              }
            }
          } );
        } );

        callback = () => {
          for ( const [ mesh, mtl ] of meshMaterialMap ) {
            ( mesh.material as THREE.Material[] )[ 0 ] = mtl;
          }
        };
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

      const boneVisMap: Map<THREE.Object3D, THREE.Mesh> = new Map();
      const index = parseInt( path.split( '/' ).pop()! );

      const parser = inspector.gltf!.parser;
      const gltf = parser.json;
      const vrm = gltf.extensions!.VRM as V0VRM.VRM;
      const boneName = vrm.humanoid!.humanBones![ index ].bone!;
      const bone = inspector.vrm!.humanoid!.getBoneNode( boneName )!;

      const mesh = genGizmo( highlightSphereGeometry );
      boneVisMap.set( bone, mesh );
      bone.add( mesh );

      return () => {
        for ( const [ bone, mesh ] of boneVisMap ) {
          bone.remove( mesh );
        }
      };

    } else if (
      pathSplit.length === 4
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'firstPerson'
    ) {

      const mesh = genGizmo( highlightSphereGeometry );
      const lookAt = inspector.vrm!.lookAt!;
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

      const parser = inspector.gltf!.parser;
      const gltf = parser.json;
      const vrm = gltf.extensions!.VRM as V0VRM.VRM;
      const blendShapeMaster = vrm.blendShapeMaster!;
      const blendShapeName = blendShapeMaster.blendShapeGroups![ index ].name!;

      const prevValue = inspector.vrm!.expressionManager!.getValue( blendShapeName )!;
      inspector.vrm!.expressionManager!.setValue( blendShapeName, 1.0 );

      return () => {
        inspector.vrm!.expressionManager!.setValue( blendShapeName, prevValue );
      };

    } else if (
      pathSplit.length === 6
      && pathSplit[ 2 ] === 'VRM'
      && pathSplit[ 3 ] === 'secondaryAnimation'
      && pathSplit[ 4 ] === 'boneGroups'
    ) {

      const index = parseInt( path.split( '/' ).pop()! );

      const parser = inspector.gltf!.parser;
      const gltf = parser.json;
      const vrm = gltf.extensions!.VRM as V0VRM.VRM;
      const secondaryAnimation = vrm.secondaryAnimation;
      const bones = secondaryAnimation?.boneGroups![ index ].bones;

      const springBoneManager = inspector.vrm!.springBoneManager!;
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
