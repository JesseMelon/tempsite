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
            material = null,
            sceneName = null,
            sceneParentIndex = null, 
            sceneParentName = null,
            position = [0, 0, 0], 
            rotation = [0, 0, 0], 
            scale = [1,1,1], 
        } = options;
        this.mesh = mesh;

        //------------------------------------------
        this.program = programInstance.program; //TODO Add a compatibility check 
        //------------------------------------------

        this.transform = scene.add({sceneName, sceneParentIndex, sceneParentName}); 

        this.rendererIndex = renderer.registerMeshInstance(mesh, this.program, this.transform.getGlobalTransform(), programInstance.uniformBufferBindings, material);
        
        this.transform.setTransform(position, rotation, scale);

        this.material = material;

        //renderer arg is merely a convenience for registering to renderer on construction. Can also 
        //be done through renderer.registerMeshInstance separately when more are needed, TODO there should be a way to copy a scene to a new renderer. 
        //this means moving renderer's instancerefs to scene to be shared among renderers.
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