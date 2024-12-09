MelonEngine.Renderer = class {
    constructor(activeCamera){
        //pointers to meshInstances will be null at [i] if no instance specific data required. instance data includes UVoffset, and UVscale.
        //this should really become a bitmask of data fields needed sent via  instead of a reference
        this.instanceRefs = []; 
        //pointers to meshInstance's mesh. TODO could expand to use indices and a mesh data system one day
        this.meshRefs = [];
        //pointers to meshInstance's shader. TODO should DEFINITELY make a shader system in order to arrange mesh instances by like shader to avoid the gl.useProgram performance bottleneck
        this.programRefs = [];
        //metadata for binding UBOs per shader
        this.uniformBufferBindingFlags = [];
        //pointers to model transforms (indirect access pattern) pointers access scene tree (or not if desired. Modular as.)
        this.modelMatrices = [];
        //the pointer to view matrix in scene (indirect access pattern again) this is preferred when updates are frequent like a moving player camera
        this.viewMatrix = activeCamera.getViewMatrix();
        //a local copy of proj matrix (direct access) for infrequent update, lower access cost, higher update cost.
        this.cameraUBO = gl.createBuffer();

        //the camera UBO is bound for the lifetime of the class
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.cameraUBO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.cameraUBO); //hard coded to binding point 0
        gl.bufferData(gl.UNIFORM_BUFFER, 16 * 3 * 4, gl.DYNAMIC_DRAW);


        this.cameraData = new Float32Array(4 * 4 * 3); //projectionMatrix, viewMatrix, modelMatrix
        this.projMatrix = mat4.create();
        this.projMatrix = mat4.copy(this.projMatrix, activeCamera.projMatrix); 
        this.cameraData.set(this.projMatrix, 32);
        this.invertedView = mat4.create();
        
    }
    setActiveCamera(camera){
        this.viewMatrix = camera.getViewMatrix();
        this.projMatrix = mat4.copy(this.projMatrix, camera.projMatrix); 
        this.cameraData.set(this.projMatrix, 32);
    }
    render(gl) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.invert(this.invertedView, this.viewMatrix)

        this.cameraData.set(this.invertedView, 16);                  

        for (let i = 0; i < this.meshRefs.length; i++) {

            const program = this.programRefs[i]
            gl.useProgram(program); //TODO batch meshinstances based on program to switch less, this will become a bottleneck otherwise

            this.cameraData.set(this.modelMatrices[i], 0);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.cameraData);

            //include lighting UBO
            // if(this.uniformBufferBindingFlags[i] & (1 << 0)){ //if there is a 1 at 0th bit
            //     sceneLighting.setNormalMatrix(modelMatrix);
            //     sceneLighting.bind(gl); //bind UBO 1 - lighting
            // }

            //bind instance specific uniforms if present
            // if (this.instanceRefs[i]){
            //     this.instanceRefs[i].bind(gl, program);
                
            // }
            
            if (this.meshRefs[i].bind(gl)) {
                gl.drawElements(gl.TRIANGLES, this.meshRefs[i].indexCount, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawArrays(gl.TRIANGLES, 0, this.meshRefs[i].indexCount);
            }
            this.meshRefs[i].unbind(gl);
        }
    }
    registerMeshInstance(meshInstance, mesh, program, modelMatrix, uniformBufferBindings) {
        this.instanceRefs.push(meshInstance);
        this.meshRefs.push(mesh);
        this.programRefs.push(program);
        this.uniformBufferBindingFlags.push(uniformBufferBindings)
        this.modelMatrices.push(modelMatrix);
        let index = this.meshRefs.length - 1;
        return index;
    }
    unregisterMeshInstance(index) {
        let maxIndex = this.meshRefs.length - 1;
        if (index >= 0 && index <= maxIndex) {
            if (index !== maxIndex) {
                this.instanceRefs[index] = this.instanceRefs[maxIndex];
                this.meshRefs[index] = this.meshRefs[maxIndex];
                this.programRefs[index] = this.programRefs[maxIndex];
                this.modelMatrices[index] = this.modelMatrices[maxIndex];
            }
            this.instanceRefs.pop();
            this.meshRefs.pop();
            this.programRefs.pop();
            this.modelMatrices.pop();
        }
    }
}