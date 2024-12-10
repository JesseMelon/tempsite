MelonEngine.ProgramInstance = class {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - WebGL context
     * @param {Object} [attributes={}] - Mesh data layout options.
     * @param {boolean} [attributes.normals=false] - Whether the mesh has normal vectors.
     * @param {boolean} [attributes.UVs=false] - Whether the mesh has UV coordinates for texturing.
     * @param {boolean} [attributes.colorRGBA=false] - Whether the mesh has per-vertex RGBA color data.
     * 
     * @param {Object} [shaderComponents={}] - Shader components to include.
     * @param {boolean} [shaderComponents.blinnPhong=false] - Whether the shader includes Blinn-Phong lighting.
     * @param {boolean} [shaderComponents.material=false] - Whether the shader supports a material structure.
     * @param {boolean} [shaderComponents.albedoTexture=false] - Whether the shader supports an albedo texture.
     * 
     * @param {WebGLProgram} [program=null] - Precompiled WebGL program. If null, a new program will be created.
     */
    constructor(gl, attributes = {}, shaderComponents = {}, program = null){
        const {normals = false, UVs = false, colorRGBA = false} = attributes;
        const {blinnPhong = false, material = false, albedoTexture = false} = shaderComponents;

        this.program = program || this.createProgram(gl, attributes, shaderComponents);
        this.uniformBufferBindings = shaderComponents;
        this.vertexAttributes = attributes;
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
        const {material = false, albedoTexture = false, blinnPhong = false} = shaderComponents;
        let location = 1;
        const vsSource = `#version 300 es
        precision mediump float;
        precision mediump int;

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

        layout(std140) uniform uCamera {
            mat4 uModelMatrix;
            mat4 uViewMatrix;
            mat4 uProjMatrix;
        };
        ${shaderComponents.blinnPhong ? 
            `   layout(std140) uniform uLight {
                vec3 positions[10];
                vec3 ambientColors[10];
                vec3 diffuseColors[10];
                vec3 specularColors[10];
                mat3 normMatrix;
                int count;
            };
            out vec3 vPosition;` : ''}
            void main() {
                gl_Position =  (uProjMatrix * (uViewMatrix * ( uModelMatrix * vec4(aPosition, 1.0))));
                ${attributes.UVs ? "vUV = aUV;":''}
                ${attributes.colorRGBA ? "vColor = aColor;":''}
                ${shaderComponents.blinnPhong && attributes.normals && shaderComponents.material ? 
                    `vec4 wsPos = uModelMatrix * vec4(aPosition, 1.0);
                    vec3 wNorm = normalize(normMatrix * aNormal); 

                    // Set output variables
                    vPosition = wsPos.xyz;  
                    vNormal = wNorm;` : ''}
            }`
        const fsSource = `#version 300 es
        precision mediump float;
        precision mediump int;
        
        layout(std140) uniform uCamera {
                mat4 uModelMatrix;
                mat4 uViewMatrix;
                mat4 uProjMatrix;
            };
        ${shaderComponents.material ? 
           `layout(std140) uniform uMaterial {
                vec3 ambientColor;
                vec3 diffuseColor;
                vec3 specularColor;
                float shine;
            };` : ''}
        ${shaderComponents.blinnPhong ? 
        `   layout(std140) uniform uLight {
                vec3 positions[10];
                vec3 ambientColors[10];
                vec3 diffuseColors[10];
                vec3 specularColors[10];
                mat3 normMatrix;
                int count;
            };
            in vec3 vNormal; 
            in vec3 vPosition;` : ''}
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
            ${shaderComponents.blinnPhong && attributes.normals && shaderComponents.material ? 
            `   vec3 ambient = vec3(0.0);
                vec3 diffuse = vec3(0.0);
                vec3 specular = vec3(0.0);
                for (int i = 0; i < count; i++){
                    vec3 l = normalize(positions[i] - vPosition); // Position -> Light
                    vec3 n = normalize(vNormal);                    // Surface normal
                    mat4 invertView = inverse(uViewMatrix);
                    vec3 c = vec3(invertView[3]);
                    vec3 v = normalize(c - vPosition);
                    vec3 h = normalize(l + v);
                    float Kd = max(dot(l, n), 0.0);
                    float Ks = pow(max(dot(n, h), 0.0),shine);
                    if (dot(n, l) < float(0.0)){ 
                    Ks = 0.0; 
                    }
                    ambient += max(ambientColor * ambientColors[i], vec3(0));
                    diffuse += max(diffuseColor * diffuseColors[i] * Kd, vec3(0));
                    specular += max(specularColor * specularColors[i] * Ks, vec3(0));
                }
            outColor += vec4(ambient + diffuse + specular, 0);` : ''}}`;
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