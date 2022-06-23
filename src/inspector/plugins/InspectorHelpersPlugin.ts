import * as THREE from 'three';
import { VRMLookAtHelper, VRMSpringBoneColliderHelper, VRMSpringBoneJointHelper } from '@pixiv/three-vrm';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorHelpersPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public readonly lookAtHelperRoot: THREE.Group;
  public readonly springBoneJointHelperRoot: THREE.Group;
  public readonly springBoneColliderHelperRoot: THREE.Group;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.lookAtHelperRoot = new THREE.Group();
    this.lookAtHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.lookAtHelperRoot );

    this.springBoneJointHelperRoot = new THREE.Group();
    this.springBoneJointHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.springBoneJointHelperRoot );

    this.springBoneColliderHelperRoot = new THREE.Group();
    this.springBoneColliderHelperRoot.renderOrder = 10000;
    inspector.scene.add( this.springBoneColliderHelperRoot );
  }

  public handleAfterUnload(): void {
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
