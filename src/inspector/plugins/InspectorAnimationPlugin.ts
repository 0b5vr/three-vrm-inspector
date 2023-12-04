import * as THREE from 'three';
import { InspectorModel } from '../InspectorModel';
import { VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { loadMixamoAnimation } from './utils/loadMixamoAnimation';
import { loadVRMAniamtion } from './utils/loadVRMAnimation';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorAnimationPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _currentLookAtQuatProxy?: VRMLookAtQuaternionProxy | null;
  private _currentAnimationMixer?: THREE.AnimationMixer | null;
  private _currentAnimationAction?: THREE.AnimationAction | null;
  private _currentAnimation?: {
    type: 'vrma' | 'mixamo';
    url: string;
  } | null;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;
  }

  public handleAfterLoad( model: InspectorModel ): void {
    const vrm = model.vrm;
    if ( vrm == null ) { return; }

    const lookAt = vrm.lookAt;
    if ( lookAt != null ) {
      this._currentLookAtQuatProxy = new VRMLookAtQuaternionProxy( lookAt as any );
      this._currentLookAtQuatProxy.name = 'lookAtQuaternionProxy';
      vrm.scene.add( this._currentLookAtQuatProxy );
    }

    this._currentAnimationMixer = new THREE.AnimationMixer( vrm.scene );

    if ( this._currentAnimation != null ) {
      this.loadAnimation( this._currentAnimation );
    }
  }

  public handleAfterUnload(): void {
    this._currentAnimationAction = null;
    this._currentAnimationMixer = null;
  }

  public handleBeforeRender( delta: number ): void {
    if ( this._currentAnimationMixer != null ) {
      this._currentAnimationMixer.update( delta );
    }
  }

  public async loadAnimation( animation: { type: 'vrma' | 'mixamo', url: string } ): Promise<void> {
    this._currentAnimation = animation;

    if ( animation.type === 'vrma' ) {
      this._loadVRMAnimation( animation.url );
    } else if ( animation.type === 'mixamo' ) {
      this._loadMixamoAnimation( animation.url );
    }
  }

  public clearAnimation(): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const action = this._currentAnimationAction;
    if ( !action ) { return; }

    this._currentAnimation = null;
    action.stop();
    this._currentAnimationAction = null;

    this._resetTargets();
  }

  private async _loadVRMAnimation( url: string ): Promise<void> {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const mixer = this._currentAnimationMixer;
    if ( !mixer ) { return; }

    if ( this._currentAnimationAction != null ) {
      this.clearAnimation();
    }

    const clip = await loadVRMAniamtion( url, vrm );

    this._currentAnimationAction = mixer.clipAction( clip );
    this._currentAnimationAction.play();
  }

  private async _loadMixamoAnimation( url: string ): Promise<void> {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const mixer = this._currentAnimationMixer;
    if ( !mixer ) { return; }

    if ( this._currentAnimationAction != null ) {
      this.clearAnimation();
    } else {
      this._resetTargets();
    }

    const clip = await loadMixamoAnimation( url, vrm );

    if ( clip ) {
      this._currentAnimationAction = mixer.clipAction( clip );
      this._currentAnimationAction.play();
    }
  }

  private _resetTargets(): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    vrm.humanoid.resetNormalizedPose();

    const expressionsMap = vrm.expressionManager?.expressionMap;
    if ( expressionsMap ) {
      Object.keys( expressionsMap ).map( ( key ) => {
        vrm.expressionManager?.setValue( key, 0.0 );
      } );
    }

    this._currentLookAtQuatProxy?.quaternion.set( 0, 0, 0, 1 );
  }
}
