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
        //this.usingUVs = options.uvs ... not yet implemented
        this.program = options.program || this.useDefaultProgram(usingNormals);
        this.mvpMatLocation = null;
        this.modelMatrix = null;
        this.mvpMatrix = null;
    }
    //TODO make indices, colors, vertices optional too
    useDefaultProgram(includeNormals = false){
        const vsSource = `#version 300 es
        precision mediump float;
        uniform mat4 uMVPMatrix;
        in vec3 aPosition;
        in vec3 aColor;
        out vec3 vColor;
        ${includeNormals ? `
            uniform mediump int uLightCount;
            uniform vec3 uLightPositions[10];
            uniform vec3 uLightColors[10];
            uniform mat3 uNormalMatrix; 
            uniform mat4 uModelMatrix;
            in vec3 aNormal; 
            out vec3 vNormal;
            out vec3 vLightDirs[10];
            ` : ''}
        void main() {
            gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
             ${includeNormals ? `
                vNormal = normalize(mat3(uNormalMatrix) * aNormal); // Pass the normal to the fragment shader
                vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0); // Get world position
                
                // Calculate light directions for each light
                for (int i = 0; i < uLightCount; i++) {
                    vLightDirs[i] = normalize(uLightPositions[i] - worldPosition.xyz);
                }
            ` : ''}
        }`;
        const fsSource = `#version 300 es
        precision mediump float;
        in vec3 vColor;
        out vec4 outColor;
        ${includeNormals ? `
            uniform mediump int uLightCount;
            uniform vec3 uLightColors[10];
            in vec3 vNormal; 
            in vec3 vLightDirs[10];
        ` : ''}
        void main() {
            vec3 color = vColor;
            ${includeNormals ? `
                for (int i = 0; i < uLightCount; i++) {
                    float lighting = max(dot(vNormal, vLightDirs[i]), 0.0); // Calculate lighting for each light
                    color += lighting * uLightColors[i]; // Apply lighting effect to color
                }
                //outColor = vec4(vLightDirs[0] * 0.5 + 0.5, 1.0);
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