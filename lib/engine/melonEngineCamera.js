MelonEngine.Camera = class{
    constructor({position = [0,0,5], viewtarget = [0,0,0], up = [0,1,0], fov = Math.PI / 4, aspectRatio = 1.0, nearClipPlane = 0.1, farClipPlane = 100} = {}) {
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