MelonEngine.ShaderComponent = class {
    constructor(type,vertexIO = "", vertexMain = "", fragIO = "", fragMain = ""){
        this.type = type;
        this.vertexIO = vertexIO;
        this.vertexMain = vertexMain;
        this.fragIO = fragIO;
        this.fragMain = fragMain;
    }
}