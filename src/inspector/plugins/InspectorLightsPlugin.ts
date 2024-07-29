import * as THREE from 'three';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorLightsPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;

  private _directionalLightAzimuth: number;
  public get directionalLightAzimuth(): number {
    return this._directionalLightAzimuth;
  }
  public set directionalLightAzimuth( value: number ) {
    this._directionalLightAzimuth = value;
    this._updateDirectionalLightPositionByAzimuthAltitude();
  }

  private _directionalLightAltitude: number;
  public get directionalLightAltitude(): number {
    return this._directionalLightAltitude;
  }
  public set directionalLightAltitude( value: number ) {
    this._directionalLightAltitude = value;
    this._updateDirectionalLightPositionByAzimuthAltitude();
  }

  private _directionalLight: THREE.DirectionalLight;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this._directionalLightAzimuth = 0.0;
    this._directionalLightAltitude = 0.0;

    this._directionalLight = new THREE.DirectionalLight( 0xffffff, Math.PI );
    this._directionalLight.position.set( 0, 0, 1 ).normalize();
    inspector.scene.add( this._directionalLight );
  }

  private _updateDirectionalLightPositionByAzimuthAltitude(): void {
    const azimuth = this._directionalLightAzimuth;
    const altitude = this._directionalLightAltitude;

    const x = Math.sin( azimuth ) * Math.cos( altitude );
    const y = Math.sin( altitude );
    const z = Math.cos( azimuth ) * Math.cos( altitude );

    this._directionalLight.position.set( x, y, z );
  }
}
