MelonEngine.Transform = class {
    constructor(scene, index) {
        this.index = index;
        this.scene = scene;
    }
    getGlobalTransform(){
        return this.scene.getGlobalTransform(this.index);
    }
    getLocalTransform(){
        return this.scene.getLocalTransform(this.index);
    }
    setTransform(position, rotation, scale) { 
        const transform = this.scene.getLocalTransform(this.index);
        mat4.identity(transform);
        mat4.translate(transform, transform, position);
        mat4.rotateX(transform, transform, rotation[0]);
        mat4.rotateY(transform, transform, rotation[1]);
        mat4.rotateZ(transform, transform, rotation[2]);
        mat4.scale(transform, transform, scale);
        this.scene.updateGlobals(this.index);
    }
    translate(positionDelta){
        const transform = this.scene.getLocalTransform(this.index);
        mat4.translate(transform, transform, positionDelta);
        this.scene.updateGlobals(this.index);
    }
    rotateX(rotationDeltaX){
        const transform = this.scene.getLocalTransform(this.index);
        mat4.rotateX(transform, transform, rotationDeltaX);
        this.scene.updateGlobals(this.index);
    }
    rotateY(rotationDeltaY){
        const transform = this.scene.getLocalTransform(this.index);
        mat4.rotateY(transform, transform, rotationDeltaY);
        this.scene.updateGlobals(this.index);
    }
    rotateZ(rotationDeltaZ){
        const transform = this.scene.getLocalTransform(this.index);
        mat4.rotateZ(transform, transform, rotationDeltaZ);
        this.scene.updateGlobals(this.index);
    }
    setRotationAlongAxis(value, axis){
        const transform = this.scene.getLocalTransform(this.index);
        const rotation = vec3.create();
        const scale = vec3.create();
        const position = vec3.create();

        mat4.getTranslation(position, transform);
        mat4.getRotation(rotation, transform);
        mat4.getScaling(scale, transform);

        rotation[axis] = value;
        this.setTransform(position, rotation, scale);
    }
    scale(scaleDelta){
        const transform = this.scene.getLocalTransform(this.index);
        mat4.scale(transform, transform, scaleDelta);
        this.scene.updateGlobals(this.index);
    }
    setScale(scale) { //prefer using scale
        const transform = this.scene.getLocalTransform(this.index);
        const previousScale = vec3.create();
        mat4.getScaling(previousScale, transform); // Extrapolate the current scale from matrix

        // calculate scale delta from new scale / previous scale
        const scaleDelta = vec3.fromValues(scale[0] / previousScale[0], scale[1] / previousScale[1], scale[2] / previousScale[2]);
        mat4.scale(transform, transform, scaleDelta);
        this.scene.updateGlobals(this.index);
    }
    lookAt(position, target, up){
        const transform = this.getLocalTransform(this.index)
        mat4.lookAt(transform, position, target, up);
        mat4.invert(transform, transform);
        this.scene.updateGlobals(this.index);
    }
}