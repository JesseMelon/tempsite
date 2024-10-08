class Camera {
    constructor() {
        this.viewMat = mat4.create();
        this.projMat = mat4.create();
        this.position = [0,0,5];
        this.target = [0,0,0];
        this.up = [0,1,0];
        this.fov = Math.PI / 4;
        this.aspectRatio = 1.0;
        this.nearClipPlane = 0.1;
        this.farClipPlane = 100.0;
    }

    updateViewMatrix() {
        mat4.lookAt(this.viewMat, this.position, this.target, this.up)
    }

    updateProjMatrix(){
        this.aspectRatio = canvas.width / canvas.height;
        mat4.perspective(this.projMat, this.fov, this.aspectRatio, this.nearClipPlane, this.farClipPlane)
    }
}
