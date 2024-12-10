MelonEngine.Renderer = class {
    constructor(activeCamera){
        //pointers to meshInstance's mesh. TODO could expand to use indices and a mesh data system one day
        this.meshRefs = [];
        //pointers to meshInstance's shader. TODO should DEFINITELY make a shader system in order to arrange mesh instances by like shader to avoid the gl.useProgram performance bottleneck
        this.programRefs = [];
        //metadata for binding UBOs per shader
        this.uniformBufferBindingFlags = [];
        //pointers to model transforms (indirect access pattern) pointers access scene tree (or not if desired. Modular as.)
        this.modelMatrices = [];
        //pointers to materials
        this.materialRefs = []; 
        //the pointer to view matrix in scene (indirect access pattern again) this is preferred when updates are frequent like a moving player camera
        this.viewMatrix = activeCamera.getViewMatrix();
        //a local copy of proj matrix (direct access) for infrequent update, lower access cost, higher update cost.
        this.cameraUBO = gl.createBuffer();

        //the camera UBO is bound for the lifetime of the class
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.cameraUBO);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.cameraUBO); //hard coded to binding point 0
        gl.bufferData(gl.UNIFORM_BUFFER, 16 * 4 * 4, gl.DYNAMIC_DRAW);


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
    render(gl, sceneLighting = null) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.invert(this.invertedView, this.viewMatrix)

        this.cameraData.set(this.invertedView, 16);    
                    
        for (let i = 0; i < this.meshRefs.length; i++) {

            const program = this.programRefs[i]
            gl.useProgram(program); //TODO batch meshinstances based on program to switch less, this will become a bottleneck otherwise

            this.cameraData.set(this.modelMatrices[i], 0);
            gl.bindBuffer(gl.UNIFORM_BUFFER, this.cameraUBO);
            gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.cameraData);

            // //include lighting UBO
            if(this.uniformBufferBindingFlags[i].blinnPhong){
                sceneLighting.setNormalMatrix(this.modelMatrices[i]);
                sceneLighting.bind(gl); //bind UBO 1 - lighting
                //console.log(gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_SIZE));
            }

            //include material UBO
            if(this.uniformBufferBindingFlags[i].material){
                console.log("why");
                if(!this.materialRefs[i]) throw new Error("no material registered for mesh at index " + i);
                this.materialRefs[i].bind(gl); //bind UBO 2 - material
            }
            
            if (this.meshRefs[i].bind(gl)) {
                gl.drawElements(gl.TRIANGLES, this.meshRefs[i].indexCount, gl.UNSIGNED_SHORT, 0);
            } else {
                throw new error ("arrays");
                gl.drawArrays(gl.TRIANGLES, 0, this.meshRefs[i].indexCount);
            }
        }
    }
    registerMeshInstance(mesh, program, modelMatrix, uniformBufferBindings, material) {
        this.meshRefs.push(mesh);
        this.programRefs.push(program);
        this.uniformBufferBindingFlags.push(uniformBufferBindings)
        this.modelMatrices.push(modelMatrix);
        this.materialRefs.push(material);
        let index = this.meshRefs.length - 1;
        return index;
    }
    unregisterMeshInstance(index) {
        //TODO implement
    }
}