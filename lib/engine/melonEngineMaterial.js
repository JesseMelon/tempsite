MelonEngine.Material = class {
    //bind UBO to position 0;
     /**
     * @constructor
     * @param {Object}                  [options]                       - initial parameters
     * @param {number[]}                [options.ambient=vec3[0,0,0]]   - Vec3 for ambient light
     * @param {number[]}                [options.diffuse=vec3[0,0,0]]   - Vec3 for diffuse lighting
     * @param {number[]}                [options.specular=vec3[0,0,0]]  - Vec3 for specular lighting
     * @param {number}                  [options.shine=0.0]             - Material Shininess
     */ 
     constructor(gl, options = {}){
        this.BINDING_POINT = 2;
        this.matUBO = gl.createBuffer();
        this.matData = new Float32Array(
            [                                                                       // UBO set up as follows
                this.ambient   = options?.ambient  ?? vec3(0, 0, 0),   // Ambient      [X][X][X][ ]
                this.diffuse   = options?.diffuse  ?? vec3(0, 0, 0),   // Diffuse      [X][X][X][ ]
                this.specular  = options?.specular ?? vec3(0, 0, 0),   // Specular     [X][X][X][X]
                this.shine     = options?.shine    ?? 0.0              // Shine     // Specular and Shine take up the full chunk
            ]
        );
    }
    // Method that would bind material data and uniforms to a Uniform Buffer Object
    bind(gl){
        // Make a buffer to hold the UBO
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.matUBO);
    }
    update(gl){
        // Make a buffer to hold the UBO
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.matUBO);
        // Update the UBO with the new data and bind
        gl.bufferData(gl.UNIFORM_BUFFER, this.matData, gl.STATIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.BINDING_POINT, this.matUBO);
        gl.bindBuffer(gl.UNIFORM_BUFFER, 0);
    }
    
    // Unbind UBO after use, prevent unintentional edits to what was saved
    unbind(gl){
        gl.bindBuffer(gl.UNIFORM_BUFFER, 0);
    }
}