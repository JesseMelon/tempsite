/**
 * Compiles a WebGL shader object from source.
 *
 * @param gl The WebGL rendering context from your canvas.
 *
 * @param shaderType The type of shader to compile. Must be one of
 * {@link WebGL2RenderingContext.VERTEX_SHADER `gl.VERTEX_SHADER`} or
 * {@link WebGL2RenderingContext.VERTEX_SHADER `gl.FRAGMENT_SHADER`}.
 *
 * @param shaderSrc The source code of the shader as a string.
 *
 * @returns The compiled shader object.
 */
export declare function compileShader(gl: WebGL2RenderingContext, shaderType: GLenum, shaderSrc: string): WebGLShader;
/**
 * Creates a single shader object of the given type by loading a source file with an AJAX request.
 *
 * ## Example
 *
 * ```js
 * const vShader = await compileShaderFromURL(gl, gl.VERTEX_SHADER, './shaders/vert.glsl');
 * const fShader = await compileShaderFromURL(gl, gl.FRAGMENT_SHADER, './shaders/frag.glsl');
 * const program = linkProgram(gl, vShader, fShader);
 * ```
 *
 * You could also use `Promise.all` to compile both in parallel:
 *
 * ```js
 * const [vShader, fShader] = await Promise.all([
 *      compileShaderFromURL(gl, gl.VERTEX_SHADER, './shaders/vert.glsl'),
 *      compileShaderFromURL(gl, gl.FRAGMENT_SHADER, './shaders/frag.glsl'),
 * ]);
 * const program = linkProgram(gl, vShader, fShader);
 * ```
 *
 * @note This function will **not** work on the `file://` protocol. You **must** be using an actual
 * server to use `fetch` (be it a local server or an actual deployment).
 *
 * @param gl The WebGL rendering context from your canvas.
 *
 * @param shaderType The type of shader to compile. Must one of
 * {@link WebGL2RenderingContext.VERTEX_SHADER `gl.VERTEX_SHADER`} or
 * {@link WebGL2RenderingContext.VERTEX_SHADER `gl.FRAGMENT_SHADER`}.
 *
 * @param shaderURL The path/URL from which to `fetch` the given shader from.
 *
 * @returns The compiled shader object.
 */
export declare function compileShaderFromURL(gl: WebGL2RenderingContext, shaderType: GLenum, shaderURL: string): Promise<WebGLShader>;
/**
 * Creates a single shader object by pulling its source code and type from the current HTML
 * document.
 *
 * This is a niche use-case. For the most part, you should prefer using {@linkcode compileShader} to
 * compile an imported source-code string or {@linkcode compileShaderFromURL} to fetch it from a
 * file on your server.
 *
 * ## Example
 *
 * This shader:
 *
 * ```html
 * <script type="x-shader/x-fragment" id="frag-shader1">
 * #version 300 es
 * <!-- .... -->
 * </script>
 * ```
 *
 * Could be compiled with:
 *
 * ```js
 * // using an ID:
 * const fShader = compileShaderFromScriptTag(gl, 'frag-shader1');
 * // or using the element:
 * const script = document.querySelector('script[type="x-shader/x-fragment"]');
 * const fShader = compileShaderFromScriptTag(gl, script);
 * ```
 *
 * @param gl Your WebGL context object.
 *
 * @param scriptElem The script tag to pull the shader's source code from.
 *
 * This argument may either be a string—in which case it used as an ID to select a `<script>`
 * element from the DOM—or a `<script>` element that you have already grabbed from the DOM.
 *
 * @returns The compiled shader object.
 */
export declare function compileShaderFromScriptTag(gl: WebGL2RenderingContext, scriptElem: string | HTMLScriptElement): WebGLShader;
/**
 * Initializes a shader program from two already-compiled GLSL shaders.
 *
 * This allows you to compile your shaders however you'd like (say if you wanted to construct their
 * source-code out of smaller strings before compiling them yourself) or to make your own
 * optimizations. For the most part, you'll be using {@linkcode compileShader} or
 * {@linkcode compileShaderFromURL} and feeding their return values into this function.
 *
 * @param gl Your WebGL context object.
 *
 * @param vertShader An already-compiled vertex shader object.
 *
 * @param fragShader An already-compiled fragment shader object.
 *
 * @returns A linked program made from the two provided shaders.
 */
export declare function linkProgram(gl: WebGL2RenderingContext, vertShader: WebGLShader, fragShader: WebGLShader): WebGLProgram;
/**
 * A wrapper function for calling {@linkcode compileShaderFromScriptTag} and {@linkcode linkProgram}
 * all in one step.
 *
 * @deprecated This function is provided for backwards compatibility with the old MV library from
 * the textbook code, which requires having your shaders available as `<script>` tags. You should
 * prefer using {@linkcode compileShader} or {@linkcode compileShaderFromURL} to compile your own
 * shader objects, in conjunction with {@linkcode linkProgram} to link them together.
 *
 * @param gl Your WebGL context object.
 *
 * @param vertShader The ID of the vertex shader's `<script>` element, or the element itself.
 *
 * @param fragShader The ID of the fragment shader's `<script>` element, or the element itself.
 *
 * @returns A compiled and linked program.
 */
export declare function initShaders(gl: WebGL2RenderingContext, vertShader: string | HTMLScriptElement, fragShader: string | HTMLScriptElement): WebGLProgram;
//# sourceMappingURL=shaders.d.ts.map