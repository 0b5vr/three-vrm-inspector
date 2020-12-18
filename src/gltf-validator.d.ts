declare module 'gltf-validator' {
  export function validateBytes(
    buffer: Uint8Array,
    options?: {
      maxIssues?: number
    },
  ): Promise<any>;
}
