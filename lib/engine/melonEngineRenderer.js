MelonEngine.Renderer = class {
    constructor(gl){
        this.instanceRefs = []; //will be null at [i] if no instance specific data required
        this.meshRefs = [];
        this.programRefs = [];
        this.modelMatrices = [];
    }
    render(gl, camera, sceneLighting = null) {

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (let i = 0; i < this.meshRefs.length; i++) {

            const program = this.programRefs[i]
            gl.useProgram(program); //TODO batch meshinstances based on program to switch less

            //compute mvpMatrix to transform model
            const modelMatrix = this.modelMatrices[i];
            const mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, camera.viewMatrix, modelMatrix); //view * model
            mat4.multiply(mvpMatrix, camera.projMatrix, mvpMatrix); // proj * (view * model)
            
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