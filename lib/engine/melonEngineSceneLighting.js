MelonEngine.SceneLighting = class { //scene lighting could be part of renderer, but is sizeable so these classes have a 1 : 1 relationship instead
    constructor(gl) {
        //TODO add light types (spot, sun, point, ...)
        this.BINDING_POINT = 1;
        this.lightUBO = gl.createBuffer();

        
        lightPositions = new Float32Array(10 * 4);
        thislightColors = new Float32Array(10 * 4);
        lightCount = new Float32Array(4);
        lightCount[0] = 0;
        normalMatrix = new Float32Array(16);
        this.lightData = new Float32Array(
            [                                                 // UBO set up as follows
                ...lightPositions,    // Position             [X][X][X][ ] x1... 10
                ...lightColors,       // Colours              [X][X][X][ ] x1... 10
                ...lightCount,        // Number of Lights     [X][ ][ ][ ] 
                ...normalMatrix
            ]                                                              
        );
    }
    // Method that would bind light to a Uniform Buffer Object
    bind(gl, modelMatrix){
        
        this.lightData.normalMatrix
        mat3.normalFromMat4(normalMatrix, modelMatrix);
        // Make a buffer to hold the UBO
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
    }
    updateBuffers(gl){
        // Make a buffer to hold the UBO
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.lightUBO);
        // Update the UBO with the new data and bind
        gl.bufferData(gl.UNIFORM_BUFFER, this.lightData, gl.STATIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.BINDING_POINT, this.lightUBO);
        gl.bindBuffer(gl.UNIFORM_BUFFER, 0);
    }
    // Unbind UBO after use, prevent unintentional edits to what was saved
    unbind(gl){
        gl.bindBuffer(gl.UNIFORM_BUFFER, 0);
    }
    registerLightSource(gl,position, color) {
        if (this.lightCount >= this.lightPositions.length / 4) {
            console.warn('Maximum light sources reached.');
            return;
        }
        const index = this.lightCount * 4;
        this.lightData.set(position, index);
        this.lightData.set(color, index + 40);
        this.lightData[80]++; 
        this.updateBuffers(gl);
        return index;
    }
    unregisterLightSource(index){ 
        //TODO implement
    }
    /* updateBuffers(gl){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lightPositionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.lightPositions, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lightColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.lightColors, gl.STATIC_DRAW);
    }*/
    /* bind(gl, program) {
        const uLightCount = gl.getUniformLocation(program, 'uLightCount');
        const uLightPositions = gl.getUniformLocation(program, 'uLightPositions');
        const uLightColors = gl.getUniformLocation(program, 'uLightColors');
        
        gl.uniform1i(uLightCount, this.lightCount);
        gl.uniform3fv(uLightPositions, this.lightPositions.subarray(0, this.lightCount * 3)); //pass only used values
        gl.uniform3fv(uLightColors, this.lightColors.subarray(0, this.lightCount * 3));
    } */
    setPosition(gl, index, x, y, z) {
        // Assuming the lightPositions array is structured as [x1, y1, z1, x2, y2, z2, ...]
        lightPos = [x, y, z];
        this.lightData.set(lightPos, index)
        this.updateBuffers(gl);
    }
    setColor(gl, index, color) {
        const colorIndex = index * 4 + 40; // Calculate the starting index for the color
        this.lightData.set(color, colorIndex);
        this.updateBuffers(gl);
    }
    setNormalMatrix(modelMatrix){
        let normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelMatrix);
        this.lightData.set(padMat3ToMat4(normalMatrix), 84);
    }
    cleanup(gl) {
        gl.deleteBuffer(this.lightPositionsBuffer);
        gl.deleteBuffer(this.lightColorsBuffer);
    }
}