import * as THREE from 'three';
import { InspectorModel } from '../InspectorModel';
import { VRMLookAtQuaternionProxy } from '@pixiv/three-vrm-animation';
import { loadMixamoAnimation } from './utils/loadMixamoAnimation';
import { loadVRMAniamtion } from './utils/loadVRMAnimation';
import { notifyObservers } from '../../utils/notifyObservers';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export interface InspectorAnimationPluginGLTFAnimation {
  type: 'gltf';
  clip: THREE.AnimationClip;
}

export interface InspectorAnimationPluginVRMAnimation {
  type: 'vrma';
  url: string;
  name: string;
}

export interface InspectorAnimationPluginMixamoAnimation {
  type: 'mixamo';
  url: string;
  name: string;
}

export type InspectorAnimationPluginAnimation
  = | InspectorAnimationPluginVRMAnimation
    | InspectorAnimationPluginMixamoAnimation
    | InspectorAnimationPluginGLTFAnimation;

export class InspectorAnimationPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  public animationChangeObservers: Set<
    (animation: InspectorAnimationPluginAnimation | null) => void
  >;

  public animationUpdateObservers: Set<
    (event: {
      time: number;
      duration: number;
    }) => void
  >;

  private _currentLookAtQuatProxy?: VRMLookAtQuaternionProxy | null;
  private _currentAnimationMixer?: THREE.AnimationMixer | null;
  private _currentAnimationAction?: THREE.AnimationAction | null;
  private _currentAnimation?: InspectorAnimationPluginAnimation | null;

  public get currentAnimation(): InspectorAnimationPluginAnimation | null | undefined {
    return this._currentAnimation;
  }

  public get gltfAnimations(): THREE.AnimationClip[] | undefined {
    return this.inspector.model?.gltf.animations;
  }

  public constructor(inspector: Inspector) {
    this.inspector = inspector;

    this.animationChangeObservers = new Set();
    this.animationUpdateObservers = new Set();
  }

  public handleAfterLoad(model: InspectorModel): void {
    const vrm = model.vrm;
    if (vrm == null) { return; }

    const lookAt = vrm.lookAt;
    if (lookAt != null) {
      this._currentLookAtQuatProxy = new VRMLookAtQuaternionProxy(lookAt as any);
      this._currentLookAtQuatProxy.name = 'lookAtQuaternionProxy';
      vrm.scene.add(this._currentLookAtQuatProxy);
    }

    this._currentAnimationMixer = new THREE.AnimationMixer(vrm.scene);

    if (this._currentAnimation != null && this._currentAnimation.type !== 'gltf') {
      this.loadAnimation(this._currentAnimation);
    }
  }

  public handleAfterUnload(): void {
    this._currentAnimationAction = null;
    this._currentAnimationMixer = null;
  }

  public handleBeforeRender(delta: number): void {
    if (this._currentAnimationMixer != null) {
      this._currentAnimationMixer.update(delta);

      const time = this._currentAnimationAction?.time ?? 0.0;
      const duration = this._currentAnimationAction?.getClip().duration ?? 0.0;
      notifyObservers(this.animationUpdateObservers, { time, duration });
    }
  }

  public async loadAnimation(animation: InspectorAnimationPluginAnimation): Promise<void> {
    if (animation.type === 'gltf') {
      this._loadGLTFAnimation(animation.clip);
    } else if (animation.type === 'vrma') {
      await this._loadVRMAnimation(animation.url);
    } else if (animation.type === 'mixamo') {
      await this._loadMixamoAnimation(animation.url);
    }

    this._currentAnimation = animation;
    notifyObservers(this.animationChangeObservers, animation);
  }

  public clearAnimation(): void {
    const vrm = this.inspector.model?.vrm;
    if (!vrm) { return; }

    const action = this._currentAnimationAction;
    if (!action) { return; }

    action.stop();
    this._currentAnimationAction = null;

    this._currentAnimation = null;
    notifyObservers(this.animationChangeObservers, null);

    this._resetTargets();
  }

  public play(): void {
    const action = this._currentAnimationAction;
    if (!action) { return; }

    action.paused = false;
  }

  public pause(): void {
    const action = this._currentAnimationAction;
    if (!action) { return; }

    action.paused = true;
  }

  public rewind(): void {
    const action = this._currentAnimationAction;
    if (!action) { return; }

    action.time = 0;
  }

  private _loadGLTFAnimation(clip: THREE.AnimationClip): void {
    const mixer = this._currentAnimationMixer;
    if (!mixer) { return; }

    if (this._currentAnimationAction != null) {
      this.clearAnimation();
    } else {
      this._resetTargets();
    }

    this._currentAnimationAction = mixer.clipAction(clip);
    this._currentAnimationAction.play();
  }

  private async _loadVRMAnimation(url: string): Promise<void> {
    const vrm = this.inspector.model?.vrm;
    if (!vrm) { return; }

    const mixer = this._currentAnimationMixer;
    if (!mixer) { return; }

    if (this._currentAnimationAction != null) {
      this.clearAnimation();
    } else {
      this._resetTargets();
    }

    const clip = await loadVRMAniamtion(url, vrm);

    this._currentAnimationAction = mixer.clipAction(clip);
    this._currentAnimationAction.play();
  }

  private async _loadMixamoAnimation(url: string): Promise<void> {
    const vrm = this.inspector.model?.vrm;
    if (!vrm) { return; }

    const mixer = this._currentAnimationMixer;
    if (!mixer) { return; }

    if (this._currentAnimationAction != null) {
      this.clearAnimation();
    } else {
      this._resetTargets();
    }

    const clip = await loadMixamoAnimation(url, vrm);

    if (clip) {
      this._currentAnimationAction = mixer.clipAction(clip);
      this._currentAnimationAction.play();
    }
  }

  private _resetTargets(): void {
    const vrm = this.inspector.model?.vrm;
    if (!vrm) { return; }

    vrm.humanoid.resetNormalizedPose();

    const expressionsMap = vrm.expressionManager?.expressionMap;
    if (expressionsMap) {
      Object.keys(expressionsMap).map((key) => {
        vrm.expressionManager?.setValue(key, 0.0);
      });
    }

    this._currentLookAtQuatProxy?.quaternion.set(0, 0, 0, 1);
  }
}
