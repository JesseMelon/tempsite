MelonEngine.MeshInstance = class{ 
    /**
     * @constructor
     * @param {MelonEngine.Mesh} mesh - mesh data
     * @param {MelonEngine.ProgramInstance} programInstance - shader
     * @param {MelonEngine.Renderer} renderer - renderer
     * @param {number[]} [position=[0, 0, 0]] - position
     * @param {number[]} [rotation=[0, 0, 0]] - rotation
     * @param {number[]} [scale=[1,1,1]] - scale
     * @param {boolean} [unique=false] - set to include instance specific shader data
     */
    constructor(mesh, programInstance, renderer, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1,1,1], unique = false) {
        this.mesh = mesh;
        this.program = programInstance.program;
        this.modelMatrix = mat4.create();
        this.meshProperties = {
            hasNormals: !!mesh.normalsBuffer,
            hasColors: !!mesh.colorsBuffer,
            hasUVs: !!mesh.uvsBuffer,
        }
        this.unique = unique;
        this.instanceData = { //TODO make this an array with index map, with bitmasks to screen for existence. 
            uvOffsetU: 0,
            uvOffsetV: 0,
            uvScaleU: 0,
            uvScaleV: 0,
        }
        this.setModelMatrix(position, rotation, scale);
        this.rendererIndex = renderer.registerMeshInstance(this.unique? this : null, mesh, this.program, this.modelMatrix)

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

    //meshInstance specific data -> informs bind method every frame
    setUVOffset(offsetU, offsetV){
        if (!this.unique) {console.warn("instance data will not be registered unless instance is marked unique in constructor");}
        if (this.meshProperties.hasUVs) {
            this.instanceData.uvOffsetU = offsetU;
            this.instanceData.uvOffsetV = offsetV;
        }else{console.warn("mesh doesnt have UVs to offset");}
    }
    setUVScale(scaleU, scaleV){
        if (!this.unique) {console.warn("instance data will not be registered unless instance is marked unique in constructor");}
        if (this.meshProperties.hasUVs) {
            this.instanceData.uvScaleU = scaleU;
            this.instanceData.uvScaleV = scaleV;
        }else{console.warn("mesh doesnt have UVs to scale");}
    }
    //TODO make a third arg which is a bitmask of the data we want from the bind method
    bind(gl, program){ //this should NOT be called unless unique is true. (but to check is to add overhead per frame)
        if (this.meshProperties.hasUVs){
            const uTexOffsetLocation = gl.getUniformLocation(program, 'uTexOffset');
            const uTexScaleLocation = gl.getUniformLocation(program, 'uTexScale');
            gl.uniform2f(uTexOffsetLocation, this.instanceData.uvOffsetU, this.instanceData.uvOffsetV);
            gl.uniform2f(uTexScaleLocation, this.instanceData.uvScaleU, this.instanceData.uvScaleV);
        }
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