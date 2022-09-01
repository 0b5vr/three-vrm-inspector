import * as THREE from 'three';
import { InspectorModel } from '../InspectorModel';
import { loadMixamoAnimation } from './utils/loadMixamoAnimation';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorAnimationPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _currentAnimationMixer?: THREE.AnimationMixer | null;
  private _currentAnimationAction?: THREE.AnimationAction | null;
  private _currentAnimationURL?: string | null;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;
  }

  public handleAfterLoad( model: InspectorModel ): void {
    const vrm = model.vrm;
    if ( vrm == null ) { return; }

    this._currentAnimationMixer = new THREE.AnimationMixer( vrm.humanoid.normalizedHumanBonesRoot );

    if ( this._currentAnimationURL != null ) {
      this.loadMixamoAnimation( this._currentAnimationURL );
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

  public loadMixamoAnimation( url: string ): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const mixer = this._currentAnimationMixer;
    if ( !mixer ) { return; }

    if ( this._currentAnimationAction != null ) {
      this.clearMixamoAnimation();
    }

    loadMixamoAnimation( url, vrm ).then( ( clip ) => {
      if ( clip ) {
        this._currentAnimationURL = url;
        this._currentAnimationAction = mixer.clipAction( clip );
        this._currentAnimationAction.play();
      }
    } );
  }

  public clearMixamoAnimation(): void {
    const vrm = this.inspector.model?.vrm;
    if ( !vrm ) { return; }

    const action = this._currentAnimationAction;
    if ( !action ) { return; }

    this._currentAnimationURL = null;
    action.stop();
    this._currentAnimationAction = null;

    vrm.humanoid.resetNormalizedPose();
  }
}
