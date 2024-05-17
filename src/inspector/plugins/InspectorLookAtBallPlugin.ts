import * as THREE from 'three';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorLookAtBallPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public readonly root: THREE.Group;
  public readonly ballOutside: THREE.Mesh;
  public readonly ballInside: THREE.Mesh;

  public isActive: boolean;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.root = new THREE.Group();
    inspector.scene.add( this.root );

    this.ballInside = new THREE.Mesh(
      new THREE.SphereGeometry( 0.01 ),
      new THREE.MeshBasicMaterial( { color: 0x440088, depthTest: false, depthWrite: false } ),
    );
    this.ballInside.renderOrder = 10001;
    this.root.add( this.ballInside );

    this.ballOutside = new THREE.Mesh(
      new THREE.SphereGeometry( 0.01 ),
      new THREE.MeshStandardMaterial( { color: 0xffffff } ),
    );
    this.ballOutside.renderOrder = 10001;
    this.root.add( this.ballOutside );

    this.isActive = false;
  }

  public handleBeforeRender(): void {
    if ( !this.isActive ) {
      this.root.visible = false;
      return;
    }

    const { model } = this.inspector;
    const vrm = model?.vrm;
    const lookAt = vrm?.lookAt;

    if ( lookAt == null ) {
      this.root.visible = false;
      return;
    }

    this.root.visible = true;
    lookAt?.getLookAtWorldPosition( this.root.position );
  }
}
