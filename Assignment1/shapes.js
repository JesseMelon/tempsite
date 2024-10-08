const { mat4 } = glMatrix;
class Camera {
    constructor() {
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.position = [0,0,5];
        this.target = [0,0,0];
        this.up = [0,1,0];
        this.fov = Math.PI / 4;
        this.aspectRatio = 1.0;
        this.nearClipPlane = 0.1;
        this.farClipPlane = 100.0;
        this.updateViewMatrix();
        this.updateProjMatrix();
    }
    setPosition(x,y,z) {
        this.position = [x, y, z];
        this.updateViewMatrix();
    }
    updateViewMatrix() {
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up)
    }
    updateProjMatrix(){ //TODO call this whenever canvas size changes
        this.aspectRatio = canvas.width / canvas.height;
        mat4.perspective(this.projMatrix, this.fov, this.aspectRatio, this.nearClipPlane, this.farClipPlane)
    }
}

class Mesh { //overwrite for different configs, this is configured for defaultprogram
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - context
     * @param {Float32Array} vertices - vertex positions
     * @param {Float32Array} colors - vertex colors
     * @param {Uint16Array} indices - vertex indices
     */
    constructor(gl, vertices, colors, indices){
        this.vertexBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indexCount = indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
    bind(gl, program){ //assumes corresponding program is being used on gl (enforced by meshinstance)
        // Retrieve attribute locations from the program. Better have the right program loaded here, scrub.
        const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
        const colorAttribLocation = gl.getAttribLocation(program, "aColor");

        //bind the buffers already on the gpu to the attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(
            positionAttribLocation, 
            3,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(
            colorAttribLocation, //attrib location
            4,                   //elements per location
            gl.FLOAT,            //type
            false,               //normalized?
            0,                   //stride (0 for auto on packed data)(3 * 4 in this case)
            0                    //offset
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        //you can still bind shader specific attributes beyong this. Just call a separate bind function to set up resources not pertaining to mesh data. 
        //this allows mesh to be used with a variety of shaders
        //if additional mesh specific data is required, overwrite mesh class and this bind method instead of binding them separately. 
        //You can also use execute these bindings from a child class by calling super within 
        //the bind method if your mesh has the same structure basic structure as this default
    }
    cleanup(gl) {
        if (this.vertexBuffer) {
            gl.deleteBuffer(this.vertexBuffer);
            this.vertexBuffer = null; // Nullify to help with garbage collection
        }
        if (this.colorsBuffer) {
            gl.deleteBuffer(this.colorsBuffer);
            this.colorsBuffer = null; // Nullify to help with garbage collection
        }
        if (this.indexBuffer) {
            gl.deleteBuffer(this.indexBuffer);
            this.indexBuffer = null; // Nullify to help with garbage collection
        }
    }
}

class MeshInstance { 
    constructor(mesh, programInstance, rendererI, position, rotation, scale) {
        this.mesh = mesh;
        this.program = programInstance.program;
        this.modelMatrix = mat4.create();
        this.updateModelMatrix(position, rotation, scale);
        this.rendererIndex = rendererI.registerMeshInstance(mesh, this.program, this.modelMatrix)
    }
    updateModelMatrix(position, rotation, scale) { //TODO could optimize by supporting deltas 
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, position);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, rotation[2]);
        mat4.scale(this.modelMatrix, this.modelMatrix, scale);
    }
    cleanup(gl, rendererI) {
        rendererI.unregisterMeshInstance(this.rendererIndex)
        //TODO make this check if the mesh is still in use.
        if (this.mesh) {
            this.mesh.cleanup(gl); // Pass the WebGL context to cleanup
            this.mesh = null;
        }
        this.program = null;
        this.modelMatrix = null;
    }
}

class ProgramInstance {
    constructor(gl, program = null ){
        this.gl = gl;
        this.program = program || this.useDefaultProgram();
        this.mvpMatLocation = null;
        this.modelMatrix = null;
        this.mvpMatrix = null;
    }

    useDefaultProgram(){
        const vsSource = `#version 300 es
        precision mediump float;

        uniform mat4 uMVPMatrix;

        in vec3 aPosition;
        in vec3 aColor;

        out vec3 vColor;

        void main() {
            gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
            vColor = aColor;
        }
        `;

        const fsSource = `#version 300 es
        precision mediump float;

        in vec3 vColor;
        out vec4 outColor;

        void main() {
            outColor = vec4(vColor, 1.0);
        }
        `;

        let program = gl.createProgram();

        //create & compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vs, vsSource);
        this.gl.shaderSource(fs, fsSource);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
            throw new Error('ERROR compiling vertex shader: ' + gl.getShaderInfoLog(vs));
        }
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
            throw new Error('ERROR compiling fragment shader: ' + gl.getShaderInfoLog(fs));
        }
        //link shaders
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
            throw new Error('ERROR linking program: ' + gl.getProgramInfoLog(program));
        }
        gl.validateProgram(program); //HACK debug context only (slow)
        if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
            throw new Error('ERROR validating program: ' + gl.getProgramInfoLog(program));
        }
        return program;
    }
    cleanup(){
        if (this.program) {
            this.gl.deleteProgram(this.program);
            this.program = null;
        }
    }
}

class renderer {
    constructor(gl){
        this.meshRefs = [];
        this.programRefs = [];
        this.modelMatrices = [];
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }
    render(gl, camera) {
        //clear frame
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //draw objects
        for (let i = 0; i < this.meshRefs.length; i++) {

            //get the right shader for target meshInstance
            const program = this.programRefs[i]
            gl.useProgram(program);
            //compute mvpMatrix
            const modelMatrix = this.modelMatrices[i];
            const mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, camera.viewMatrix, modelMatrix); //view * model
            mat4.multiply(mvpMatrix, camera.projMatrix, mvpMatrix); // proj * (view * model)
            
            //bind data (mvp is always necessary, so binding is here, other attribute bindings happen 
            //in the polymorphic mesh.bind() to accommodate a range of shaders)
            const mvpMatrixLocation = gl.getUniformLocation(program, "uMVPMatrix");
            gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix);

            this.meshRefs[i].bind(gl, program);

            //TODO make the primitive a variable stored in mesh to accommodate more mesh configs
            gl.drawElements(gl.TRIANGLES, this.meshRefs[i].indexCount, gl.UNSIGNED_SHORT, 0);

        }
    }
    registerMeshInstance(mesh, program, modelMatrix) {
        this.meshRefs.push(mesh);
        this.programRefs.push(program);
        this.modelMatrices.push(modelMatrix);
        let index = this.meshRefs.length - 1;
        return index;
    }
    unregisterMeshInstance(index) {
        let maxIndex = this.meshRefs.length - 1;
        if (index >= 0 && index <= maxIndex) {
            if (index !== maxIndex) {
                this.meshRefs[index] = this.meshRefs[maxIndex];
                this.programRefs[index] = this.programRefs[maxIndex];
                this.modelMatrices[index] = this.modelMatrices[maxIndex];
            }
            this.meshRefs.pop();
            this.programRefs.pop();
            this.modelMatrices.pop();
        }
    }
}