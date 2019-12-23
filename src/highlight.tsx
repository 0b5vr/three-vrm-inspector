import * as THREE from 'three';
import { VRMSchema, VRMSpringBoneDebug } from '@pixiv/three-vrm';
import { Colors } from './constants/Colors';
import { Inspector } from './Inspector';

const _colorConstant = new THREE.Color( Colors.constant );

const highlightMaterial = new THREE.MeshNormalMaterial( {
  transparent: true,
  skinning: true,
  morphTargets: true,
  morphNormals: true,
  depthTest: false,
  depthWrite: false
} );

const highlightWireframeMaterial = new THREE.MeshBasicMaterial( {
  color: _colorConstant,
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

export function highlight( inspector: Inspector, path: string ): ( () => void ) | undefined {
  const pathSplit = path.split( '/' );

  if (
    path.startsWith( '/nodes/' ) && pathSplit.length === 3
  ) {

    const index = parseInt( pathSplit.pop()! );
    let callback: ( () => void ) | undefined;
    inspector.gltf!.parser.getDependency( 'node', index ).then( ( node ) => {
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
    path.startsWith( '/meshes/' ) && pathSplit.length === 3
  ) {

    const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
    const index = parseInt( pathSplit.pop()! );
    let callback: ( () => void ) | undefined;
    inspector.gltf!.parser.getDependency( 'mesh', index ).then( ( group: THREE.Mesh | THREE.Group ) => {

      group.traverse( ( obj ) => {
        if ( ( obj as any ).isMesh ) {
          const mesh = obj as THREE.Mesh;
          if ( Array.isArray( mesh.material ) ) {
            meshMaterialMap.set( mesh, mesh.material[ 0 ] );
            mesh.material[ 0 ] = highlightMaterial;
          }
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
    path.startsWith( '/meshes/' ) && path.includes( '/primitives/' ) && pathSplit.length === 5
  ) {

    const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
    const meshIndex = parseInt( pathSplit[ 2 ] );
    const primIndex = parseInt( pathSplit[ 4 ] );
    let callback: ( () => void ) | undefined;

    inspector.gltf!.parser.getDependency( 'mesh', meshIndex ).then( ( groupOrMesh: THREE.Mesh | THREE.Group ) => {
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
    ( path.startsWith( '/materials/' ) && pathSplit.length === 3 ) ||
    ( path.startsWith( '/extensions/VRM/materialProperties/' ) && pathSplit.length === 5 )
  ) {

    const meshMaterialMap: Map<THREE.Mesh, THREE.Material> = new Map();
    const index = parseInt( pathSplit.pop()! );
    let callback: ( () => void ) | undefined;

    inspector.gltf!.parser.getDependencies( 'mesh' ).then( ( groups: Array<THREE.Mesh | THREE.Group> ) => {
      inspector.gltf!.parser.json.meshes!.forEach( ( schemaMesh, iMesh ) => {
        const primitives = schemaMesh.primitives;
        primitives.forEach( ( schemaPrimitive, iPrimitive ) => {
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
    path.startsWith( '/extensions/VRM/humanoid/humanBones/' ) && pathSplit.length === 6
  ) {

    const boneVisMap: Map<THREE.Object3D, THREE.Mesh> = new Map();
    const index = parseInt( path.split( '/' ).pop()! );
    const boneName = inspector.gltf!.parser.json.extensions!.VRM.humanoid.humanBones[ index ].bone;
    const bones = inspector.vrm!.humanoid!.getBoneNodes( boneName );

    bones.forEach( ( bone ) => {
      const mesh = genGizmo( highlightSphereGeometry );
      boneVisMap.set( bone, mesh );
      bone.add( mesh );
    } );

    return () => {
      for ( const [ bone, mesh ] of boneVisMap ) {
        bone.remove( mesh );
      }
    };

  } else if (
    path.startsWith( '/extensions/VRM/firstPerson' ) && pathSplit.length === 4
  ) {

    const mesh = genGizmo( highlightSphereGeometry );
    const firstPerson = inspector.vrm!.firstPerson!;
    firstPerson.getFirstPersonWorldPosition( mesh.position );
    inspector.scene.add( mesh );

    return () => {
      inspector.scene.remove( mesh );
    };

  } else if (
    path.startsWith( '/extensions/VRM/firstPerson/meshAnnotations' ) && pathSplit.length === 5
  ) {

    inspector.layerMode = 'firstPerson';

    return () => {
      inspector.layerMode = 'thirdPerson';
    };

  } else if (
    path.startsWith( '/extensions/VRM/blendShapeMaster/blendShapeGroups/' ) && pathSplit.length === 6
  ) {

    const index = parseInt( path.split( '/' ).pop()! );
    const blendShapeMaster: VRMSchema.BlendShape
      = inspector.gltf!.parser.json.extensions!.VRM.blendShapeMaster!;
    const blendShapeName = blendShapeMaster.blendShapeGroups![ index ].name!;

    const prevValue = inspector.vrm!.blendShapeProxy!.getValue( blendShapeName )!;
    inspector.vrm!.blendShapeProxy!.setValue( blendShapeName, 1.0 );

    return () => {
      inspector.vrm!.blendShapeProxy!.setValue( blendShapeName, prevValue );
    };

  } else if (
    path.startsWith( '/extensions/VRM/secondaryAnimation/boneGroups/' ) && pathSplit.length === 6
  ) {

    const index = parseInt( path.split( '/' ).pop()! );
    const springBoneManager = inspector.vrm!.springBoneManager!;
    const springBoneGroup = springBoneManager.springBoneGroupList[ index ] as VRMSpringBoneDebug[];

    const gizmoColorMap = new Map<THREE.ArrowHelper, THREE.Color>();
    springBoneGroup.forEach( ( springBone ) => {
      const gizmo = springBone.getGizmo();
      const prevColor = ( gizmo.line.material as THREE.LineBasicMaterial ).color.clone();
      gizmoColorMap.set( gizmo, prevColor );
      gizmo.setColor( _colorConstant );
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
