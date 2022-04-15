import CameraControls from 'camera-controls';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorCameraControlsPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _controls?: CameraControls;

  public get controls(): CameraControls | undefined {
    return this._controls;
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;
  }

  public handleAfterSetup(): void {
    const { camera, canvas } = this.inspector;

    this._controls = new CameraControls( camera, canvas! );
    this._controls.setTarget( 0.0, 1.0, 0.0 );
  }

  public handleBeforeRender( delta: number ): void {
    if ( this._controls ) {
      this._controls.update( delta );
    }
  }
}
