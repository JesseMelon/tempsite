MelonEngine.MeshInstance = class{ 
    /**
     * @constructor
     * @param {MelonEngine.Scene} scene - scene
     * @param {MelonEngine.Mesh} mesh - mesh data
     * @param {MelonEngine.ProgramInstance} programInstance - shader
     * @param {MelonEngine.Renderer} renderer - renderer
     * @param {string} [options.sceneName] - name of object in scene
     * @param {number} [options.sceneParentIndex] - index of desired parent in scene
     * @param {string} [options.sceneParentName] - name of desired parent in scene
     * @param {number[]} [options.position=[0, 0, 0]] - position
     * @param {number[]} [options.rotation=[0, 0, 0]] - rotation
     * @param {number[]} [options.scale=[1,1,1]] - scale
     * @param {boolean} [options.unique=false] - set to include instance specific shader data
     */
    constructor(scene, mesh, programInstance, renderer, options = {} ) {
        const { 
            sceneName = null,
            sceneParentIndex = null, 
            sceneParentName = null,
            position = [0, 0, 0], 
            rotation = [0, 0, 0], 
            scale = [1,1,1], 
            unique = false 
        } = options;
        this.mesh = mesh;
        this.program = programInstance.program;
        this.transform = scene.add({sceneName, sceneParentIndex, sceneParentName}); 
        this.meshProperties = {
            hasNormals: !!mesh.normalsBuffer,
            hasColors: !!mesh.colorsBuffer,
            hasUVs: !!mesh.uvsBuffer,
        }
        this.unique = unique;
        this.instanceData = { //TODO move this to a system 
            uvOffsetU: 0,
            uvOffsetV: 0,
            uvScaleU: 0,
            uvScaleV: 0,
        }
        this.rendererIndex = renderer.registerMeshInstance(this.unique? this : null, mesh, this.program, this.transform.getGlobalTransform());
        
        this.transform.setTransform(position, rotation, scale);

        //renderer arg is merely a convenience for registering to renderer on construction. Can also 
        //be done through renderer.registerMeshInstance separately when more are needed, TODO there should be a way to copy a scene to a new renderer. 
        //this means moving renderer's instancerefs to scene to be shared among renderers.
    }
    //meshInstance specific data -> informs bind method for renderer
    //HACK do way better on this. Having to reference meshInstance for instance data is too cache inefficient.
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
    bind(gl, program){ //this should NOT be called unless unique is true. (but to check is to add overhead potentially per frame)
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