MelonEngine.ProgramInstance = class {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {Object} [attributes={}] - mesh data layout, list of bools
     * @param {Object} [shaderComponents={}]  - shader components, list of bools
     * @param {WebGLProgram} program - WebGL program (optional)
     */
    constructor(gl, attributes = {}, shaderComponents = {}, program = null){
        const {normals = false, UVs = false, colorRGBA = false} = attributes;
        const {lighting = false, material = false, albedoTexture = false} = shaderComponents;

        this.program = program || this.createProgram(gl, attributes, shaderComponents);
    }
    // static AttributeType = {
    //     POSITION: {order: 0, size: 3},
    //     NORMAL: {order: 1, size: 3},
    //     UV: {order: 2, size: 2},
    //     VCOLORRGB: {order: 3, size: 3},
    //     VCOLORRGBA: {order: 4, size: 4},
    //     TANGENT: {order: 5, size: 3},
    //     BITANGENT: {order: 6, size: 3},
    //     BONE_INDEX: {order: 7, size: 4},
    //     BONE_WEIGHT: {order: 8, size: 4},
    //     CUSTOM0: {order: 9, size: 2 },
    //     CUSTOM1: {order: 10, size: 3 },
    //     CUSTOM2: {order: 11, size: 4 },
    // }

    createProgram(gl, attributes = {}, shaderComponents = {}){
        const {normals = false, UVs = false, colorRGBA = false} = attributes;
        const {lighting = false, material = false, albedoTexture = false} = shaderComponents;
        let location = 1;
        const vsSource = `#version 300 es
        precision mediump float;

        layout(location = 0) in vec3 aPosition;
        ${attributes.normals ? 
            `layout(location = ${location++}) in vec3 aNormal;
            out vec3 vNormal;` : ''}
        ${attributes.UVs ? 
            `layout(location = ${location++}) in vec2 aUV;
            out vec2 vUV;` : ''}
        ${attributes.colorRGBA ? 
            `layout(location = ${location++}) in vec4 aColor;
            out vec4 vColor;` : ''}

        layout(std140) uniform Camera {
            mat4 uModelMatrix;
            mat4 uViewMatrix;
            mat4 uProjMatrix;
        };
        ${shaderComponents.lighting ? 
            `layout(std140) uniform Light {
                vec3 uLightPositions[10];
                vec3 uLightColors[10];
                mediump int uLightCount;
                mat3 uNormMatrix;
            };
            flat out vec3 vLightDirs[10];
            flat out vec3 vLightColors[10];
            flat out mediump int vLightCount; //TODO: add out vec3 vnormals` : ''}
        ${shaderComponents.material ? 
            `layout(std140) uniform Material {
                vec3 ambient;
                vec3 diffuse;
                vec3 specular;
                float shine;
            };` : ''}
        void main() {
            gl_Position =  uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
            ${attributes.UVs ? "vUV = aUV;":''}
            ${attributes.colorRGBA ? "vColor = aColor;":''}
            ${shaderComponents.lighting && attributes.normals ? 
                `vNormal = normalize(mat3(uNormMatrix) * aNormal);
                vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
                for (int i = 0; i < uLightCount; i++) {
                    vLightDirs[i] = normalize(uLightPositions[i] - worldPosition.xyz);
                    vLightColors[i] = uLightColors[i];
                }
                vLightCount = uLightCount;` : ''}
        }`
        const fsSource = `#version 300 es
        precision mediump float;
        ${attributes.normals ? 
            `
            flat in mediump int vLightCount;
            flat in vec3 vLightColors[10];
            flat in vec3 vLightDirs[10];
            in vec3 vNormal; ` : ''}
        ${attributes.UVs ? 
            `in vec2 vUV;
            uniform vec2 uTexOffset;
            uniform vec2 uTexScale;` : ''}
        ${attributes.colorRGBA ? "in vec4 vColor;" : ''}
        ${shaderComponents.albedoTexture ?`uniform sampler2D uAlbedoTexture;`: ''}
        out vec4 outColor;

        void main() {
            outColor = vec4(0);
            ${attributes.colorRGBA ? "outColor += vColor;" : ''}
            ${attributes.UVs && shaderComponents.albedoTexture ? `outColor.rgb += texture(uAlbedoTexture, (vUV * (uTexScale == vec2(0.0, 0.0) ? vec2 (1.0) : uTexScale)) + uTexOffset).rgb;` : ''}
            ${attributes.normals ? 
            `   for (int i = 0; i < vLightCount; i++) {
                    float lighting = max(dot(vNormal, vLightDirs[i]), 0.0);
                    outColor += lighting * vec4(vLightColors[i], 1.0);}` : ''}}`;
        console.log(vsSource);
        console.log(fsSource);

        const program = gl.createProgram();
        //create & compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.shaderSource(fs, fsSource);
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
        }
    }
}