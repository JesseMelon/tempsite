MelonEngine.SceneLighting = class { //scene lighting could be part of renderer, but is sizeable so these classes have a 1 : 1 relationship instead
    constructor(gl) {
        //TODO add light types (spot, sun, point, ...)
        this.BINDING_POINT = 1;
        this.lightUBO = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferData(gl.UNIFORM_BUFFER, (4 * 10 * 4 + 16 + 1) * 4, gl.STATIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        this.lightData = new Float32Array(4 * 10 * 4 + 16 + 1);
            /*[                                                   // UBO set up as follows
                ...lightPositions: Float32Array(10 * 4);          // Position             [X][X][X][ ] x1... 10
                ...lightAmbientColors: Float32Array(10 * 4);      // Ambient              [X][X][X][ ] x1... 10
                ...lightDiffuseColors: Float32Array(10 * 4);      // Diffuse              [X][X][X][ ] x1... 10
                ...lightSpecularColors: Float32Array(10 * 4);     // Specular             [X][X][X][ ] x1... 10
                ...normalMatrix: Float32Array(16)                 // transformed normals
                ...lightCount: float32Array(4);                   // Number of Lights     [X][ ][ ][ ] 
            ] */                                                             
    }
    // Method that would bind light to a Uniform Buffer Object
    bind(gl){
        // Make a buffer to hold the UBO
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.BINDING_POINT, this.lightUBO);
    }
    updateBuffers(gl){
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferData(gl.UNIFORM_BUFFER, this.lightData, gl.STATIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.BINDING_POINT, this.lightUBO);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    // Unbind UBO after use, prevent unintentional edits to what was saved
    unbind(gl){
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    registerLightSource(gl, options = { position: [0,0,0], ambientColor: [1,1,1], diffuseColor: [1,1,1], specularColor: [1,1,1]}) {
        if (this.lightData[176] >= 10) {
           console.warn('Maximum light sources reached.');
           return;
        }
        const index = this.lightData[176] * 4;
        this.lightData[176]++; 
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.lightData);
        return index;
    }
    unregisterLightSource(index){ 
        //TODO implement
    }
    setPosition(gl, index, position) {
        if (index >= 10) throw new error ("not a valid light index")
        // Assuming the lightPositions array is structured as [x1, y1, z1, pad, x2, y2, z2, ...]
        this.lightData.set(position, 4 * index);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, (4* index) * 4, new Float32Array(position));
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setAmbientColor(gl, index, ambientColor) {
        if (index >= 10) throw new error ("not a valid light index")
        // Assuming the lightPositions array is structured as [x1, y1, z1, x2, y2, z2, ...]
        this.lightData.set(ambientColor, 4* index + 40);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, (4* index + 40) * 4, new Float32Array(ambientColor));
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setDiffuseColor(gl, index, diffuseColor) {
        if (index >= 10) throw new error ("not a valid light index")
        // Assuming the lightPositions array is structured as [x1, y1, z1, x2, y2, z2, ...]
        this.lightData.set(diffuseColor, 4* index + 80);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, (4* index + 80) * 4, new Float32Array(diffuseColor));
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setSpecular(gl, index, specularColor) {
        if (index >= 10) throw new error ("not a valid light index")
        // Assuming the lightPositions array is structured as [x1, y1, z1, x2, y2, z2, ...]
        this.lightData.set(specularColor, 4* index + 120)
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, (4* index + 120) * 4, new Float32Array(specularColor));
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    setNormalMatrix(modelMatrix){
        let normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelMatrix);
        this.lightData.set(this.padMat3ToMat4(normalMatrix), 160);
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 160 * 4, normalMatrix);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }
    cleanup(gl) {
        gl.deleteBuffer(this.lightPositionsBuffer);
        gl.deleteBuffer(this.lightColorsBuffer);
    }
    padMat3ToMat4(mat3){
        if (mat3.length !== 9) {
            throw new Error("Input must be a 9-element array representing a mat3.");
        }
    
        // Create a 16-element array for the mat4 (padded)
        let mat4 = new Float32Array(16);
    
        // Copy the 3x3 matrix elements into the 4x4 matrix (std140 requires padding)
        mat4[0] = mat3[0];  
        mat4[1] = mat3[1];  
        mat4[2] = mat3[2];  
        mat4[3] = 0.0;      
    
        mat4[4] = mat3[3];  
        mat4[5] = mat3[4];  
        mat4[6] = mat3[5];  
        mat4[7] = 0.0;     
    
        mat4[8] = mat3[6];  
        mat4[9] = mat3[7];  
        mat4[10] = mat3[8]; 
        mat4[11] = 0.0;     
    
        mat4[12] = 0.0;     
        mat4[13] = 0.0;     
        mat4[14] = 0.0;     
        mat4[15] = 1.0;    
    
        return mat4;
    }
}