/*!
 * The schema is taken from https://github.com/KhronosGroup/glTF-Validator/blob/master/docs/validation.schema.json
 * gltf-validator is distributed under Apache License 2.0
 * https://github.com/KhronosGroup/glTF-Validator/blob/master/docs/validation.schema.json
 *
 * Converted using quicktype
 * https://quicktype.io/
 */

/**
 * Output of glTF-Validator
 */
export interface ValidationReport {
  /**
   * An object containing various metrics about the validated asset. May be undefined for
   * invalid inputs.
   */
  info?:  Info;

  issues: Issues;

  /**
   * MIME type of validated asset. Undefined when file format is not recognized.
   */
  mimeType?: any;

  /**
   * URI of validated asset.
   */
  uri?: string;

  /**
   * UTC timestamp of validation time.
   */
  validatedAt?: Date;

  /**
   * Version string of glTF-Validator. Must follow semver syntax.
   */
  validatorVersion: string;
}

/**
 * An object containing various metrics about the validated asset. May be undefined for
 * invalid inputs.
 */
export interface Info {
  /**
   * Names of glTF extensions required to properly load this asset.
   */
  extensionsRequired?: string[];

  /**
   * Names of glTF extensions used somewhere in this asset.
   */
  extensionsUsed?: string[];

  /**
   * Tool that generated this glTF model.
   */
  generator?: string;

  /**
   * The minimum glTF version that this asset targets.
   */
  minVersion?: string;

  resources?:  Resource[];

  /**
   * The glTF version that this asset targets.
   */
  version: string;
}

export interface Resource {
  /**
   * Byte length of the resource. Undefined when the resource wasn't available.
   */
  byteLength?: number;

  /**
   * Image-specific metadata.
   */
  image?:    Image;

  mimeType?: string;

  pointer?:  string;

  storage?:  any;

  /**
   * URI. Defined only for external resources.
   */
  uri?: string;
}

/**
 * Image-specific metadata.
 */
export interface Image {
  bits?:      number;
  format?:    Format;
  height:     number;
  primaries?: Primaries;
  transfer?:  Transfer;
  width:      number;
}

export enum Format {
  Luminance = 'luminance',
  LuminanceAlpha = 'luminance-alpha',
  RGB = 'rgb',
  RGBA = 'rgba',
}

export enum Primaries {
  Custom = 'custom',
  Srgb = 'srgb',
}

export enum Transfer {
  Custom = 'custom',
  Linear = 'linear',
  Srgb = 'srgb',
}

export interface Issues {
  messages:    MessageObject[];
  numErrors:   number;
  numHints:    number;
  numInfos:    number;
  numWarnings: number;

  /**
   * Indicates that validation output is incomplete due to too many messages.
   */
  truncated: boolean;
}

export interface MessageObject {
  code:    string;
  message: string;

  /**
   * Byte offset in GLB file. Applicable only to GLB issues.
   */
  offset?: number;

  /**
   * JSON Pointer to the object causing the issue.
   */
  pointer?: string;
  severity: any;
}
