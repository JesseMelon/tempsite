MelonEngine.MeshInstance = class{ 
    constructor(mesh, programInstance, renderer, position, rotation, scale = [1,1,1]) {
        this.mesh = mesh;
        this.program = programInstance.program;
        this.modelMatrix = mat4.create();
        this.setModelMatrix(position, rotation, scale);
        this.rendererIndex = renderer.registerMeshInstance(mesh, this.program, this.modelMatrix)
        //TODO make the renderer arg optional, as you may want to be rendered in multiple or none
        //renderer arg is merely a convenience for registering to renderer on construction. Can also 
        //be done through renderer.registerMeshInstance separately
    }
    setModelMatrix(position, rotation, scale) { 
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, position);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, rotation[2]);
        mat4.scale(this.modelMatrix, this.modelMatrix, scale);
    }
    translate(positionDelta){
        mat4.translate(this.modelMatrix, this.modelMatrix, positionDelta)
    }
    rotateX(rotationDeltaX){
        mat4.rotateX(this.modelMatrix, this.modelMatrix, rotationDeltaX);
    }
    rotateY(rotationDeltaY){
        mat4.rotateY(this.modelMatrix, this.modelMatrix, rotationDeltaY);
    }
    rotateZ(rotationDeltaZ){
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, rotationDeltaZ);
    }
    scale(scaleDelta){
        mat4.scale(this.modelMatrix, this.modelMatrix, scaleDelta);
    }
    setScale(scale) { //prefer using scale
        const previousScale = vec3.create();
        mat4.getScaling(previousScale, this.modelMatrix); // Extrapolate the current scale from modelmatrix

        // calculate scale delta from new scale / previous scale
        const scaleDelta = vec3.fromValues(scale[0] / previousScale[0], scale[1] / previousScale[1], scale[2] / previousScale[2]);
        mat4.scale(this.modelMatrix, this.modelMatrix, scaleDelta);
    }
    cleanup(gl) {
        renderer.unregisterMeshInstance(this.rendererIndex)
        //TODO make this check if the mesh is still in use.
        if (this.mesh) {
            this.mesh.cleanup(gl); // Pass the WebGL context to cleanup
            this.mesh = null;
        }
        this.program = null;
        this.modelMatrix = null;
    }
}