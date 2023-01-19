import * as THREE from 'three';
import * as V0VRM from '@pixiv/types-vrm-0.0';
import { Colors } from '../../constants/Colors';
import { HighlighterRuleFunction } from '../Highlighter';
import { VRMSpringBoneJoint, VRMSpringBoneJointHelper } from '@pixiv/three-vrm';

const colorConstant = new THREE.Color( Colors.constant );

export const highlightVRM0SecondaryAnimationBoneGroup: HighlighterRuleFunction = (
  { index },
  { json, inspector, parser },
) => {
  const indexNum = parseInt( index, 10 );

  const vrm = json.extensions!.VRM as V0VRM.VRM;
  const secondaryAnimation = vrm.secondaryAnimation;
  const bones = secondaryAnimation?.boneGroups![ indexNum ].bones;

  const springBoneManager = inspector.model!.vrm!.springBoneManager!;
  const nodeJointMap = new Map<THREE.Object3D, VRMSpringBoneJoint>();
  for ( const joint of springBoneManager.joints ) {
    nodeJointMap.set( joint.bone, joint );
  }

  const helperRoot = inspector.helpersPlugin.springBoneJointHelperRoot;
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
};
