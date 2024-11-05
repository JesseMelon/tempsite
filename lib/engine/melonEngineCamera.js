MelonEngine.Camera = class {
    /**
     * @constructor
     * @param {Object} options - Configuration options for the camera.
     * @param {number[]} [options.position=[0,0,5]] - The position of the camera in 3D space.
     * @param {number[]} [options.viewtarget=[0,0,0]] - The point the camera is looking at.
     * @param {number[]} [options.up=[0,1,0]] - The up direction vector for the camera.
     * @param {number} [options.fov=Math.PI / 4] - The field of view of the camera in radians.
     * @param {number} [options.aspectRatio=1.0] - The aspect ratio of the camera (width / height).
     * @param {number} [options.nearClipPlane=0.1] - The distance to the near clipping plane.
     * @param {number} [options.farClipPlane=100] - The distance to the far clipping plane.
     */
    constructor({position = [0,0,5], viewtarget = [0,0,0], up = [0,1,0], fov = Math.PI / 4, aspectRatio = 1.0, nearClipPlane = 0.1, farClipPlane = 100} = {}) {
        this.transform = new MelonEngine.Transform(position); 
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.position = position;
        this.target = viewtarget;
        this.up = up;
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.nearClipPlane = nearClipPlane;
        this.farClipPlane = farClipPlane;
        this.updateViewMatrix();
        this.updateProjMatrix();
    }
    setPosition(x,y,z) {
        this.position = [x, y, z];
        this.updateViewMatrix();
        this.updateProjMatrix();
    }
    updateViewMatrix() { //TODO this can be expanded upon for walking around or rotating etc
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up)
    }
    updateProjMatrix(){ //call this whenever canvas size changes. Aspect ratio is canvas.width / canvas.height;
        mat4.perspective(this.projMatrix, this.fov, this.aspectRatio, this.nearClipPlane, this.farClipPlane)
    }
}