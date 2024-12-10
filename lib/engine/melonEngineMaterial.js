MelonEngine.Material = class {
    //bind UBO to position 0;
     /**
     * @constructor
     * @param {Object}                  [options]                       - initial parameters
     * @param {number[]}                [options.ambientColor=vec3[1,1,1]]   - Vec3 for ambient light
     * @param {number[]}                [options.diffuseColor=vec3[1,1,1]]   - Vec3 for diffuse lighting
     * @param {number[]}                [options.specularColor=vec3[1,1,1]]  - Vec3 for specular lighting
     * @param {number}                  [options.shine=0.0]             - Material Shininess
     */ 
     constructor(gl, options = {ambientColor: [1,1,1], diffuseColor: [1,1,1], specularColor: [1,1,1] }){
        this.BINDING_POINT = 2;
        this.materialUBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.materialUBO);
        gl.bufferData(gl.UNIFORM_BUFFER, 4 * 3 * 4, gl.STATIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        this.materialData = new Float32Array(4 * 3);    //local copy unnecessary
            // [                                                                       // UBO set up as follows
            //     this.ambient   = options?.ambient  ?? vec3(0, 0, 0),   // Ambient      [X][X][X][x]
            //     this.shine     = options?.shine    ?? 0.0,              // Shine     // Ambient and Shine take up the full chunk
            //     this.diffuse   = options?.diffuse  ?? vec3(0, 0, 0),   // Diffuse      [X][X][X][ ]
            //     this.specular  = options?.specular ?? vec3(0, 0, 0)   // Specular     [X][X][X][ ]
            // ]
    }
    // Method that would bind material data and uniforms to a Uniform Buffer Object
    bind(gl){
        gl.bindBufferBase(gl.UNIFORM_BUFFER,this.BINDING_POINT, this.materialUBO);
    }

    setAmbientColor(rgbColor){
        this.materialData.set(rgbColor,0);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.materialUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, rgbColor);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setShine(value){
        this.materialData.set(value,3);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.materialUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 3 * 4, rgbColor);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setDiffuseColor(rgbColor){
        this.materialData.set(rgbColor,4);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.materialUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 4, rgbColor);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setSpecularColor(rgbColor){
        this.materialData.set(rgbColor,8);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.materialUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 8 * 4, rgbColor);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    
    // Unbind UBO after use, prevent unintentional edits to what was saved
    unbind(gl){
        gl.bindBuffer(gl.UNIFORM_BUFFER, 0);
    }
}