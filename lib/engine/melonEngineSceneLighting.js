MelonEngine.SceneLighting = class {
    constructor(gl) {
        //TODO add light types (spot, sun, point, ...)
        this.lightPositionsBuffer = gl.createBuffer();
        this.lightColorsBuffer = gl.createBuffer();
        this.lightPositions = new Float32Array(10 * 3); //10 light arbitrtary cap
        this.lightColors = new Float32Array(10 * 3);
        this.lightCount = 0;
    }
    registerLightSource(gl,position, color) {
        if (this.lightCount >= this.lightPositions.length / 3) {
            console.warn('Maximum light sources reached.');
            return;
        }
        const index = this.lightCount * 3;
        this.lightPositions.set(position, index);
        this.lightColors.set(color, index);
        this.lightCount++;
        this.updateBuffers(gl);
        return index;
    }
    unregisterLightSource(index){
        if (index < 0 || index >= this.lightCount) {
            console.warn('Invalid index for light source removal.');
            return;
        }
        //move last element into one that is removed
        if (index !== this.lightCount - 1) {
            const lastIndex = (this.lightCount - 1) * 3;
            this.lightPositions.set(this.lightPositions.subArray(lastIndex, lastIndex + 3), index * 3);
            this.lightColors.set(this.lightColors.subarray(lastIndex, lastIndex + 3), index * 3);
        }
        this.lightCount--;
        this.updateBuffers(gl);
    }
    updateBuffers(gl){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lightPositionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.lightPositions, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.lightColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.lightColors, gl.STATIC_DRAW);
    }
    bind(gl, program) {
        const uLightCount = gl.getUniformLocation(program, 'uLightCount');
        const uLightPositions = gl.getUniformLocation(program, 'uLightPositions');
        const uLightColors = gl.getUniformLocation(program, 'uLightColors');
        
        gl.uniform1i(uLightCount, this.lightCount);
        gl.uniform3fv(uLightPositions, this.lightPositions.subarray(0, this.lightCount * 3)); //pass only used values
        gl.uniform3fv(uLightColors, this.lightColors.subarray(0, this.lightCount * 3));
    }
    setPosition(gl, index, x, y, z) {
        // Assuming the lightPositions array is structured as [x1, y1, z1, x2, y2, z2, ...]
        this.lightPositions[index] = x;   // x coordinate
        this.lightPositions[index + 1] = y; // y coordinate
        this.lightPositions[index + 2] = z; // z coordinate
        this.updateBuffers(gl);
    }
    
    
    setColor(gl, index, color) {
        const colorIndex = index * 3; // Calculate the starting index for the color
        this.lightColors[colorIndex] = color[0];        // r
        this.lightColors[colorIndex + 1] = color[1];    // g
        this.lightColors[colorIndex + 2] = color[2];    // b
        this.updateBuffers(gl);
    }
    cleanup(gl) {
        gl.deleteBuffer(this.lightPositionsBuffer);
        gl.deleteBuffer(this.lightColorsBuffer);
    }
}