MelonEngine.Camera = class {
    /**
     * @constructor
     * @param {MelonEngine.Scene} scene - A place to call world space.
     * @param {Object} options - Configuration options for the camera.
     * @param {string} [options.sceneName=null] - the name for object lookup in scene tree.
     * @param {number} [options.sceneParentID=null] - the index of the object desired as parent in scene.
     * @param {string} [options.sceneParentName=null] - the name of the object desired as parent in scene.
     * @param {number[]} [options.position=[0,0,5]] - The position of the camera in 3D space.
     * @param {number[]} [options.target=[0,0,0]] - The point the camera is looking at.
     * @param {number[]} [options.up=[0,1,0]] - The up direction vector for the camera.
     * @param {number} [options.fov=Math.PI / 4] - The field of view of the camera in radians.
     * @param {number} [options.aspectRatio=1.0] - The aspect ratio of the camera (width / height).
     * @param {number} [options.nearClipPlane=0.1] - The distance to the near clipping plane.
     * @param {number} [options.farClipPlane=100] - The distance to the far clipping plane.
     */
    constructor(scene, options = {}) {
        const {
            sceneName = null,
            sceneParentIndex = null, 
            sceneParentName = null,
            position = [0, 0, 5], 
            target = [0, 0, 0], 
            up = [0, 1, 0], 
            fov = Math.PI / 4, 
            aspectRatio = 1.0, 
            nearClipPlane = 0.1, 
            farClipPlane = 100
        } = options;
        this.transform = scene.add({sceneName, sceneParentIndex, sceneParentName});
        this.projMatrix = mat4.create();

        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.nearClipPlane = nearClipPlane;
        this.farClipPlane = farClipPlane;
        this.transform.lookAt(position, target, up); // set view matrix
        this.setProjMatrix();

    }
    getViewMatrix(){ //redundant function for convenience (as transform may not be equated to view matrix)
        return this.transform.getGlobalTransform();
    }
    repositionAroundTarget(position, target, up) {
        this.transform.setPosition(position);
        this.transform.lookAt(position, target, up);
    }
    setProjMatrix(){ //call this whenever canvas size changes. Aspect ratio is canvas.width / canvas.height;
        mat4.perspective(this.projMatrix, this.fov, this.aspectRatio, this.nearClipPlane, this.farClipPlane)
    }
}