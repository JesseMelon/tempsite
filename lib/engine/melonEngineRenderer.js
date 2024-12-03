MelonEngine.Renderer = class {
    constructor(activeCamera){
        //pointers to meshInstances will be null at [i] if no instance specific data required. instance data includes UVoffset, and UVscale.
        //this should really become a bitmask of data fields needed sent via  instead of a reference
        this.instanceRefs = []; 
        //pointers to meshInstance's mesh. TODO could expand to use indices and a mesh data system one day
        this.meshRefs = [];
        //pointers to meshInstance's shader. TODO should DEFINITELY make a shader system in order to arrange mesh instances by like shader to avoid the gl.useProgram performance bottleneck
        this.programRefs = [];
        //pointers to model transforms (indirect access pattern) pointers access scene tree (or not if desired. Modular as.)
        this.modelMatrices = [];
        //the pointer to view matrix in scene (indirect access pattern again) this is preferred when updates are frequent like a moving player camera
        this.viewMatrix = activeCamera.getViewMatrix();
        //a local copy of proj matrix (direct access) for infrequent update, lower access cost, higher update cost.
        this.projMatrix = mat4.create();
        this.projMatrix = mat4.copy(this.projMatrix, activeCamera.projMatrix); 
        this.invertedView = mat4.create();
    }
    setActiveCamera(camera){
        this.viewMatrix = camera.getViewMatrix();
        this.projMatrix = mat4.copy(this.projMatrix, camera.projMatrix); 
    }
    render(gl, sceneLighting = null) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.invert(this.invertedView, this.viewMatrix)

        for (let i = 0; i < this.meshRefs.length; i++) {

            const program = this.programRefs[i]
            gl.useProgram(program); //TODO batch meshinstances based on program to switch less, this will become a bottleneck otherwise

            //compute mvpMatrix to transform model
            const modelMatrix = this.modelMatrices[i];//refactor to scene
            const mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, this.invertedView, modelMatrix); //view * model
            mat4.multiply(mvpMatrix, this.projMatrix, mvpMatrix); // proj * (view * model)
            
            //bind MVP
            const mvpMatrixLocation = gl.getUniformLocation(program, "uMVPMatrix");
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix);
            
            //bind mesh
            this.meshRefs[i].bind(gl, program);
            if (this.meshRefs[i].normalsBuffer && sceneLighting) {
                sceneLighting.bind(gl, program);
                //transform and bind normals
                const normalMatrix = mat3.create();
                mat3.normalFromMat4(normalMatrix, modelMatrix);
                const uNormalMatrixLocation = gl.getUniformLocation(program, 'uNormalMatrix');
                gl.uniformMatrix3fv(uNormalMatrixLocation, false, normalMatrix);

                //pass modelMatrix for light distances
                const uModelMatrixLocation = gl.getUniformLocation(program, 'uModelMatrix');
                gl.uniformMatrix4fv(uModelMatrixLocation, false, modelMatrix);
            }
            
            //bind instance specific uniforms if present
            if (this.instanceRefs[i]){
                this.instanceRefs[i].bind(gl, program);
            }

            //TODO make the primitive a variable stored in mesh to accommodate more mesh configs
            gl.drawElements(gl.TRIANGLES, this.meshRefs[i].indexCount, gl.UNSIGNED_SHORT, 0);
        }
    }
    registerMeshInstance(meshInstance, mesh, program, modelMatrix) {
        this.instanceRefs.push(meshInstance);
        this.meshRefs.push(mesh);
        this.programRefs.push(program);
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