MelonEngine.ProgramInstance = class {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {Object} [options={}] - Configuration options (optional)
     * @param {WebGLProgram} [options.program] - WebGL program (optional)
     * @param {boolean} [options.usingNormals=false] - Use normals (optional)
     * @param {boolean} [options.usingUVs=false] - use UVs (optional)
     */
    constructor(gl, options = {} ){
        let usingNormals = options.normals || false;
        let usingUVs = options.uvs || false;
        this.program = options.program || this.createProgram(usingNormals, usingUVs);
        this.mvpMatLocation = null;
        this.modelMatrix = null;
        this.mvpMatrix = null;
    }

    createProgram(gl, shaderComponents){
        const vsSource = [];
        
        vsSource.push(`#version 300 es
        precision mediump float;`);

        shaderComponents.forEach(shaderComponent => {
            vsSource.push(shaderComponent.vertexIO);
        });

        vsSource.push(`\nvoid main() {`);

        shaderComponents.forEach(shaderComponent => {
            vsSource.push(shaderComponent.vertexMain);
        });

        vsSource.push(`\n}`);

        const fsSource = [];

        fsSource.push(`#version 300 es
        precision mediump float;`);

        shaderComponents.forEach(shaderComponent => {
            fsSource.push(shaderComponent.fragIO);
        });

        fsSource.push(`\nout vec4 outColor;\nvoid main() {`);

        shaderComponents.forEach(shaderComponent => {
            fsSource.push(shaderComponent.fragMain);
        });

        fsSource.push(`\n}`);
        
        const vsSourceStr = vsSource.join('');
        const fsSourceStr = fsSource.join('');

        const program = gl.createProgram();
        //create & compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vs, vsSourceStr);
        gl.shaderSource(fs, fsSourceStr);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
            throw new Error('ERROR compiling vertex shader: ' + gl.getShaderInfoLog(vs));
        }
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
            throw new Error('ERROR compiling fragment shader: ' + gl.getShaderInfoLog(fs));
        }
        //link shaders
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
            throw new Error('ERROR linking program: ' + gl.getProgramInfoLog(program));
        }
        gl.validateProgram(program); //HACK debug context only (slow)
        if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
            throw new Error('ERROR validating program: ' + gl.getProgramInfoLog(program));
        }
        return program;
    }
    cleanup(){
        if (this.program) {
            gl.deleteProgram(this.program);
        }
    }
    static mvpComponent = new MelonEngine.ShaderComponent(
        "position",
        //vertex IO
        `in vec3 aPosition;
        uniform mat4 uMVPMatrix;`,
        //vertex main
        `gl_Position = uMVPMatrix * vec4(aPosition, 1.0);`,
    )
    static vertexRGBComponent = new MelonEngine.ShaderComponent(
        "vColor"
        //vertex IO
        `in vec3 aColor;
        out vec4 vColor;`,
        //vertex main
        `vColor = aColor;`,
        //frag IO
        `in vec3 vColor;`,
        //frag main
        `outColor = (vColor, 1.0);`
    )
    static uvsComponent = new MelonEngine.ShaderComponent(
        //todo
    )
    static normalsLightingComponent = new MelonEngine.ShaderComponent(
        //todo
    )
}