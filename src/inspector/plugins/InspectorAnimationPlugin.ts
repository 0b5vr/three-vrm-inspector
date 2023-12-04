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

    if ( vrm.lookAt != null ) {
      this._currentLookAtQuatProxy = new VRMLookAtQuaternionProxy( vrm.lookAt );
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

  public loadAnimation( animation: { type: 'vrma' | 'mixamo', url: string } ): void {
    this._currentAnimation = animation;

    if ( animation.type === 'vrma' ) {
      this.loadVRMAnimation( animation.url );
    } else if ( animation.type === 'mixamo' ) {
      this.loadMixamoAnimation( animation.url );
    }
  }

  public loadVRMAnimation( url: string ): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const mixer = this._currentAnimationMixer;
    if ( !mixer ) { return; }

    if ( this._currentAnimationAction != null ) {
      this.clearAnimation();
    }

    loadVRMAniamtion( url, vrm ).then( ( clip ) => {
      this._currentAnimationAction = mixer.clipAction( clip );
      this._currentAnimationAction.play();
    } );
  }

  public loadMixamoAnimation( url: string ): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const mixer = this._currentAnimationMixer;
    if ( !mixer ) { return; }

    if ( this._currentAnimationAction != null ) {
      this.clearAnimation();
    } else {
      this._resetTargets();
    }

    loadMixamoAnimation( url, vrm ).then( ( clip ) => {
      if ( clip ) {
        this._currentAnimationAction = mixer.clipAction( clip );
        this._currentAnimationAction.play();
      }
    } );
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

  private _resetTargets(): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    vrm.humanoid.resetNormalizedPose();

    Object.keys( vrm.expressionManager?.expressionMap ).map( ( key ) => {
      vrm.expressionManager?.setValue( key, 0.0 );
    } );

    this._currentLookAtQuatProxy?.quaternion.set( 0, 0, 0, 1 );
  }
}
