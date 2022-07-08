import { ValidationReport } from './ValidationReport';
import { validateBytes } from 'gltf-validator';
import type { Inspector } from '../Inspector';
import type { InspectorPlugin } from './InspectorPlugin';

export class InspectorGLTFValidatorPlugin implements InspectorPlugin {
  public static get VALIDATOR_MAX_ISSUES(): number {
    return 100;
  }

  public readonly inspector: Inspector;

  private __validationReport: ValidationReport | null;

  public get validationReport(): ValidationReport | null {
    return this.__validationReport;
  }

  public constructor( inspector: Inspector ) {
    this.inspector = inspector;

    this.__validationReport = null;
  }

  public async validate(
    maxIssues: number = InspectorGLTFValidatorPlugin.VALIDATOR_MAX_ISSUES
  ): Promise<ValidationReport | null> {
    const buffer = this.inspector.model?.buffer;
    if ( !buffer ) { return null; }

    const validationReport = await validateBytes(
      new Uint8Array( buffer ),
      { maxIssues },
    ).catch( ( error ) => console.error( 'Validation failed: ', error ) );

    this.__validationReport = validationReport;

    return validationReport;
  }

  public handleAfterLoad(): void {
    this.validate();
  }

  public handleAfterUnload(): void {
    this.__validationReport = null;
  }
}
