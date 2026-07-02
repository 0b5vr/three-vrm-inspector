import * as THREE from 'three';
import { EventEmittable } from '../../utils/EventEmittable';
import { InspectorModel } from '../InspectorModel';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { applyMixins } from '../../utils/applyMixins';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

const _v3A = new THREE.Vector3();
const _eulerA = new THREE.Euler();

export type InspectorLookAtTargetPosition = [ number, number, number ];

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging, @typescript-eslint/no-empty-object-type
export interface InspectorLookAtPlugin extends EventEmittable<{
  changeTargetPosition: { targetPosition: InspectorLookAtTargetPosition };
}> {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class InspectorLookAtPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _enableLookAt: boolean;
  private _lookAtTarget: THREE.Object3D;
  private _transformControls?: TransformControls;

  public get enableLookAt(): boolean {
    return this._enableLookAt;
  }

  public set enableLookAt(value: boolean) {
    this._enableLookAt = value;

    if (this._transformControls) {
      this._transformControls.enabled = value;
      this._transformControls.getHelper().visible = value;
    }

    if (value) {
      this._enableLookAtTarget();
    } else {
      this._disableLookAtTarget();
    }
  }

  public get targetPosition(): InspectorLookAtTargetPosition {
    return this._lookAtTarget.position.toArray();
  }

  public set targetPosition(value: InspectorLookAtTargetPosition) {
    this._lookAtTarget.position.fromArray(value);
    this._emitChangeTargetPosition();
  }

  public constructor(inspector: Inspector) {
    this.inspector = inspector;

    this._enableLookAt = false;

    this._lookAtTarget = new THREE.Object3D();
    inspector.scene.add(this._lookAtTarget);
  }

  public handleAfterSetup(): void {
    const { scene, camera, canvas } = this.inspector;

    this._transformControls = new TransformControls(camera, canvas);
    scene.add(this._transformControls.getHelper());

    this._transformControls.attach(this._lookAtTarget);

    this._transformControls.enabled = false;
    this._transformControls.getHelper().visible = false;

    this._transformControls.addEventListener('dragging-changed', (event) => {
      const cameraControls = this.inspector.cameraControlsPlugin.controls;
      if (cameraControls) {
        cameraControls.enabled = !event.value;
      }
    });

    this._transformControls.addEventListener('objectChange', () => {
      this._emitChangeTargetPosition();
    });
  }

  public handleAfterLoad(model: InspectorModel): void {
    const { vrm } = model;
    if (vrm == null) { return; }

    const head = vrm.humanoid?.getNormalizedBoneNode('head');
    if (head != null) {
      head.getWorldPosition(_v3A);
      this._lookAtTarget.position.set(0.0, 0.0, 5.0).add(_v3A);
      this._emitChangeTargetPosition();
    }

    if (this._enableLookAt) {
      this._enableLookAtTarget();
    }
  }

  private _emitChangeTargetPosition(): void {
    this._emit('changeTargetPosition', { targetPosition: this.targetPosition });
  }

  private _enableLookAtTarget(): void {
    const lookAt = this.inspector.model?.vrm?.lookAt;
    if (!lookAt) { return; }

    lookAt.target = this._lookAtTarget;
  }

  private _disableLookAtTarget(): void {
    const lookAt = this.inspector.model?.vrm?.lookAt;
    if (!lookAt) { return; }

    lookAt.target = undefined;
    lookAt.applier.lookAt(_eulerA.set(0.0, 0.0, 0.0));
  }
}

applyMixins(InspectorLookAtPlugin, [EventEmittable]);
