import * as THREE from 'three';
import { InspectorModel } from '../InspectorModel';
import { VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { loadMixamoAnimation } from './utils/loadMixamoAnimation';
import { loadVRMAniamtion } from './utils/loadVRMAnimation';
import { notifyObservers } from '../../utils/notifyObservers';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export interface InspectorAnimationPluginAnimation {
  type: 'vrma' | 'mixamo';
  url: string;
  name: string;
}

export class InspectorAnimationPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public animationChangeObservers: Set<
    ( animation: InspectorAnimationPluginAnimation | null ) => void
  >;
  public animationUpdateObservers: Set<
    ( event: {
      time: number;
      duration: number;
    } ) => void
  >;

  private _currentLookAtQuatProxy?: VRMLookAtQuaternionProxy | null;
  private _currentAnimationMixer?: THREE.AnimationMixer | null;
  private _currentAnimationAction?: THREE.AnimationAction | null;
  private _currentAnimation?: InspectorAnimationPluginAnimation | null;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.animationChangeObservers = new Set();
    this.animationUpdateObservers = new Set();
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

      const time = this._currentAnimationAction?.time ?? 0.0;
      const duration = this._currentAnimationAction?.getClip().duration ?? 0.0;
      notifyObservers( this.animationUpdateObservers, { time, duration } );
    }
  }

  public async loadAnimation( animation: InspectorAnimationPluginAnimation ): Promise<void> {
    if ( animation.type === 'vrma' ) {
      await this._loadVRMAnimation( animation.url );
    } else if ( animation.type === 'mixamo' ) {
      await this._loadMixamoAnimation( animation.url );
    }

    this._currentAnimation = animation;
    notifyObservers( this.animationChangeObservers, animation );
  }

  public clearAnimation(): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const action = this._currentAnimationAction;
    if ( !action ) { return; }

    action.stop();
    this._currentAnimationAction = null;

    this._currentAnimation = null;
    notifyObservers( this.animationChangeObservers, null );

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
