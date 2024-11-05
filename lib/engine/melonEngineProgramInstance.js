MelonEngine.ProgramInstance = class {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {Object} [options={}] - Configuration options (optional)
     * @param {WebGLProgram} [options.program] - WebGL program (optional)
     * @param {boolean} [options.normals=false] - Use normals (optional)
     */
    constructor(gl, options = {} ){
        this.gl = gl;
        let usingNormals = options.normals || false;
        let usingUVs = options.uvs || false;
        this.program = options.program || this.useDefaultProgram(usingNormals, usingUVs);
        this.mvpMatLocation = null;
        this.modelMatrix = null;
        this.mvpMatrix = null;
    }
    useDefaultProgram(includeNormals = false, includeUVs = false){
        const vsSource = `#version 300 es
        precision mediump float;
        uniform mat4 uMVPMatrix;
        in vec3 aPosition;
        ${includeUVs ? "in vec2 aUV;" : "in vec3 aColor;"}
        ${includeNormals ? `
            uniform mediump int uLightCount;
            uniform vec3 uLightPositions[10];
            uniform vec3 uLightColors[10];
            uniform mat3 uNormalMatrix; 
            uniform mat4 uModelMatrix;
            in vec3 aNormal; 
            out vec3 vNormal;
            out vec3 vLightDirs[10];
            ` : ''
        }
        ${includeUVs ? "out vec2 vUV;" : "out vec3 vColor;"}
        void main() {
            gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
            ${includeUVs ? "vUV = aUV;":"vColor = aColor;"}
            ${includeNormals ? `
                vNormal = normalize(mat3(uNormalMatrix) * aNormal);
                vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
                for (int i = 0; i < uLightCount; i++) {
                    vLightDirs[i] = normalize(uLightPositions[i] - worldPosition.xyz);
                }
            ` : ''
            }
        }`;
        const fsSource = `#version 300 es
        precision mediump float;
        ${includeUVs ? `
            in vec2 vUV;
            uniform vec2 uTexOffset;
            uniform vec2 uTexScale;
            uniform sampler2D uTexture;` : "in vec3 vColor;"
        }
        out vec4 outColor;
        ${includeNormals ? `
            uniform mediump int uLightCount;
            uniform vec3 uLightColors[10];
            in vec3 vNormal; 
            in vec3 vLightDirs[10];
        ` : ''}
        void main() {
            vec3 color = ${includeUVs ? `texture(uTexture, (vUV * (uTexScale == vec2(0.0, 0.0) ? vec2 (1.0) : uTexScale)) + uTexOffset).rgb;` : "vColor;"}
            ${includeNormals ? `
                for (int i = 0; i < uLightCount; i++) {
                    float lighting = max(dot(vNormal, vLightDirs[i]), 0.0);
                    color += lighting * uLightColors[i];
                }
            ` : ''}
            outColor = vec4(color, 1.0);
        }`;
        const program = gl.createProgram();
        //create & compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vs, vsSource);
        this.gl.shaderSource(fs, fsSource);
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
            this.gl.deleteProgram(this.program);
            this.program = null;
        }
    }
}