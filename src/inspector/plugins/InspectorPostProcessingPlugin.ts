import * as THREE from 'three';
import { ACESFilmicToneMappingShader } from 'three/examples/jsm/shaders/ACESFilmicToneMappingShader';
import { Inspector } from '../Inspector';
import { InspectorPlugin } from './InspectorPlugin';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export class InspectorPostProcessingPlugin implements InspectorPlugin {
  public readonly inspector: Inspector;
  public readonly bloomPass: UnrealBloomPass;
  public readonly toneMappingPass: ShaderPass;

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2( 4, 4 ),
      1.0, // strength
      0.5, // radius
      1.0, // threshold
    );
    this.bloomPass.enabled = false;

    this.toneMappingPass = new ShaderPass( ACESFilmicToneMappingShader );
    this.toneMappingPass.enabled = false;
  }

  public handleAfterSetup(): void {
    const composer = this.inspector.composer!;

    composer.addPass( this.bloomPass );
    composer.addPass( this.toneMappingPass );
  }
}
