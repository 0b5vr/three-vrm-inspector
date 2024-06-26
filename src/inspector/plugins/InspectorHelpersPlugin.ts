import * as THREE from 'three';
import { VRMHumanoidHelper, VRMLookAtHelper, VRMSpringBoneColliderHelper, VRMSpringBoneJointHelper } from '@pixiv/three-vrm';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorHelpersPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public readonly gridHelper: THREE.GridHelper;
  public readonly axesHelper: THREE.AxesHelper;
  public readonly humanoidHelperRoot: THREE.Group;
  public readonly lookAtHelperRoot: THREE.Group;
  public readonly springBoneJointHelperRoot: THREE.Group;
  public readonly springBoneColliderHelperRoot: THREE.Group;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.gridHelper = new THREE.GridHelper( 10, 10 );
    inspector.scene.add( this.gridHelper );

    this.axesHelper = new THREE.AxesHelper( 5 );
    inspector.scene.add( this.axesHelper );

    this.humanoidHelperRoot = new THREE.Group();
    this.humanoidHelperRoot.visible = false;
    this.humanoidHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.humanoidHelperRoot );

    this.lookAtHelperRoot = new THREE.Group();
    this.lookAtHelperRoot.visible = false;
    this.lookAtHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.lookAtHelperRoot );

    this.springBoneJointHelperRoot = new THREE.Group();
    this.springBoneJointHelperRoot.visible = false;
    this.springBoneJointHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.springBoneJointHelperRoot );

    this.springBoneColliderHelperRoot = new THREE.Group();
    this.springBoneColliderHelperRoot.visible = false;
    this.springBoneColliderHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.springBoneColliderHelperRoot );
  }

  public handleAfterUnload(): void {
    this.humanoidHelperRoot.children.concat().forEach( ( helper ) => {
      this.humanoidHelperRoot.remove( helper );
      ( helper as VRMHumanoidHelper ).dispose();
    } );

    this.springBoneJointHelperRoot.children.concat().forEach( ( helper ) => {
      this.springBoneJointHelperRoot.remove( helper );
      ( helper as VRMSpringBoneJointHelper ).dispose();
    } );

    this.springBoneColliderHelperRoot.children.concat().forEach( ( helper ) => {
      this.springBoneColliderHelperRoot.remove( helper );
      ( helper as VRMSpringBoneColliderHelper ).dispose();
    } );

    this.lookAtHelperRoot.children.concat().forEach( ( helper ) => {
      this.lookAtHelperRoot.remove( helper );
      ( helper as VRMLookAtHelper ).dispose();
    } );
  }
}
