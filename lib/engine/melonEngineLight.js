MelonEngine.Light = class {
    constructor(gl, sceneLighting, position, color){
        this.sceneLighting = sceneLighting;
        this.sceneIndex = sceneLighting.registerLightSource(gl, position, color);
    }
    setPosition(gl, x, y, z) {
        this.sceneLighting.setPosition(gl, this.sceneIndex, x, y, z);
    }
    setColor(gl, color) {
        this.sceneLighting.setColor(gl, this.sceneIndex, color);
    }
}