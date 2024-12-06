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
        
    }

    //We want to parse a list of UBOs, vertex attributes, and textures, then include one of each in a template, under standard names for use in shaders.

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

        fsSource.push(`\nout vec4 outColor;\nvoid main() {\noutColor = vec4(0.0);`);

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
        new MelonEngine.ShaderComponentType([], [MelonEngine.Mesh.AttributeType.POSITION], []),
        //vertex IO
        `in vec3 aPosition;
        uniform mat4 uMVPMatrix;`,
        //no function
        ``,
        //vertex main
        `gl_Position = uMVPMatrix * vec4(aPosition, 1.0);`,
    )
    static vertexRGBComponent = new MelonEngine.ShaderComponent(
        "vColor",
        //vertex IO
        `in vec3 aColor;
        out vec3 vColor;`,
        //vertex main
        `vColor = aColor;`,
        //frag IO
        `in vec3 vColor;`,
        //no function
        ``,
        //frag main
        `outColor += (vColor, 1.0);`
    )
    static vertexRGBAComponent = new MelonEngine.ShaderComponent(
        "vColor",
        //vertex IO
        `in vec4 aColor;
        out vec4 vColor;`,
        //vertex main
        `vColor = aColor;`,
        //frag IO
        `in vec4 vColor;`,
        //no function
        ``,
        //frag main
        `outColor += vColor;`
    )

    static blinnPhongComponent = new MelonEngine.shaderComponent(
        "vColor",
        //vertex IO
        `uniform mat3 uNormMatrix;
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjMatrix;
        out vec3 vPosition;
        out vec3 vNormal;`,
        //vertex main
        `vec4 wsPos = uModelMatrix * vec4(aPosition, 1.0);
        vec3 wNorm = normalize(uNormMatrix * aNormal); 
        vPosition = wsPos.xyz;  
        vNormal = wNorm;
        gl_Position = uProjMatrix * uViewMatrix * wsPos;`,
        //frag IO
        `in vec3 vPosition;
        in vec3 vNormal;

        struct Material {
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            float shine;
        };

        struct Light {
            vec3 ambient;
            vec3 diffuse;
            vec3 specular;
            vec3 position;
        };

        uniform Material uMaterial;
        uniform Light uLight;
        uniform mat4 uViewMatrix;`,
        
        //function BlinnPhong
        `vec3 blinnPhong(Material material, Light light) {
            vec3 l = normalize(light.position - vPosition); // Position -> Light
            vec3 n = normalize(vNormal);                    // Surface normal
            mat4 invertView = inverse(uViewMatrix);
            vec3 c = vec3(invertView[3]);
            vec3 v = normalize(c - vPosition);
            vec3 h = normalize(l + v);
            float Kd = max(dot(l, n), 0.0);
            float Ks = pow(max(dot(n, h), 0.0),material.shine);
            if (dot(n, l) < float(0.0)){ 
            Ks = 0.0; 
            }
            vec3 ambient = max(material.ambient * light.ambient, vec3(0));
            vec3 diffuse = max(material.diffuse * light.diffuse * Kd, vec3(0));
            vec3 specular = max(material.specular * light.specular * Ks, vec3(0));


            return ambient + diffuse + specular;
        }`,

        //frag main
        `outColor += vec4(blinnPhong(uMaterial, uLight), 1);`
        
    )

    static uvsComponent = new MelonEngine.ShaderComponent(
        //todo
    )
    static normalsLightingComponent = new MelonEngine.ShaderComponent(
        //todo
    )
}