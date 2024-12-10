MelonEngine.Light = class {
    constructor(gl, sceneLighting, options = {position: [0,0,0], ambientColor: [1,1,1], diffuseColor: [1,1,1], specularColor: [1,1,1]}){
        this.sceneLighting = sceneLighting;
        this.sceneIndex = sceneLighting.registerLightSource(gl,{position: options.position, ambientColor: options.ambientColor, diffuseColor: options.diffuseColor, specularColor: options.specularColor});
    }
    setPosition(gl, position) {
        this.sceneLighting.setPosition(gl, this.sceneIndex, position);
    }
    setAmbientColor(gl, ambientColor) {
        this.sceneLighting.setColor(gl, this.sceneIndex, ambientColor);
    }
    setDiffuseColor(gl, diffuseColor) {
        this.sceneLighting.setColor(gl, this.sceneIndex, diffuseColor);
    }
    setSpecularColor(gl, specularColor) {
        this.sceneLighting.setColor(gl, this.sceneIndex, specularColor);
    }
}