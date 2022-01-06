export interface WebGLMemoryInfo {
  memory: {
    /**
     * bytes used by buffers
     */
    buffer: number;

    /**
     * bytes used by textures
     */
    texture: number;

    /**
     * bytes used by renderbuffers
     */
    renderbuffer: number;

    /**
     * bytes used by the canvas
     */
    drawingbuffer: number;

    /**
     * bytes used in total
     */
    total: number;
  },
  resources: {
    /**
     * count of buffers
     */
    buffer: number;

    /**
     * count of renderbuffers
     */

    renderbuffer: number;
    /**
     * count of programs
     */

    program: number;

    /**
     * count of query objects, WebGL2 only
     */
    query: number;

    /**
     * count of samplers, WebGL2 only
     */
    sampler: number;

    /**
     * count of shaders
     */
    shader: number;

    /**
     * count of sync objects, WebGL2 only
     */
    sync: number;

    /**
     * count of textures
     */
    texture: number;

    /**
     * count of transformfeedbacks, WebGL2 only
     */
    transformFeedback: number;

    /**
     * count of vertexArrays, only if used or WebGL2
     */
    vertexArray: number;
  }
}
