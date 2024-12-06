/**
* * @param {MelonEngine.ShaderComponentType} type - An array of objects defining the mesh attributes required by the shader component.

*/
MelonEngine.ShaderComponent = class {
    constructor(type, vertexFunc = "", vertexMain = "", fragFunc = "", fragMain = ""){

        this.type = type; //determine IO
        /*
        this.vertexI = vertexI;
        this.vertexO = vertexO;
        this.fragI = fragI;
        this.fragO = fragO;
        */

        this.vertexFunc = vertexFunc;
        this.vertexMain = vertexMain;


        
        this.fragFunc = fragFunc;
        this.fragMain = fragMain;
    }
}
/**
 * @param {Array<UBO>} UBOs - An array of integers referencing the binding indices of the Uniform Buffer Objects (UBOs) required by this shader component.
 * @param {Array<{AttributeType}>} meshAttributes - An array of objects defining the mesh attributes required by the shader component.
 * @param {Array<number>} textures - An array of textures binding indices required by the shader component.
*/

MelonEngine.ShaderComponentType = class {
    constructor(UBOs, meshAttributes, textures){
        this.UBOs = UBOs
        this.meshAttributes = meshAttributes
        this.textures = textures
    }
}