MelonEngine.Mesh = class { //overwrite for different configs, this is configured for defaultprogram
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - context
     * @param {Float32Array} vertices - vertex positions
     * @param {Float32Array} colors - vertex colors
     * @param {Uint16Array} indices - vertex indices
     * @param {Float32Array} [normals] - vertex normals (optional)
     */
    constructor(gl, vertices, colors, indices, normals = null){
        this.vertexBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.normalsBuffer = normals ? gl.createBuffer() : null;
        this.indexBuffer = gl.createBuffer();
        this.indexCount = indices.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        if (this.normalsBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
    bind(gl, program){ //assumes desired compadible program is being used on gl (enforced by meshinstance). 
        // Retrieve attribute locations from the program. Better have the right programs loaded here, scrub.
        const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
        const colorAttribLocation = gl.getAttribLocation(program, "aColor");
        const normalAttribLocation = gl.getAttribLocation(program, "aNormal");

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
        );
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
        if (this.normalsBuffer && normalAttribLocation !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            gl.enableVertexAttribArray(normalAttribLocation);
            gl.vertexAttribPointer(
                normalAttribLocation, 
                3, 
                gl.FLOAT, 
                false, 
                0, 
                0
            );
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        //you can still bind shader specific attributes beyong this. Just call a separate bind function to set up resources not pertaining to mesh data. 
        //this allows mesh to be used with a variety of shaders
        //if additional mesh specific data is required, overwrite mesh class and this bind method instead of binding them separately. 
        //You can also execute these bindings from a child class by calling super within the bind method if your mesh has the same structure basic structure as this default
    }
    cleanup(gl) { //a mesh can be used across multiple instances. TODO make sure ALL instances are finished (refcounted)
        if (this.vertexBuffer) {
            gl.deleteBuffer(this.vertexBuffer);
            this.vertexBuffer = null;
        }
        if (this.colorsBuffer) {
            gl.deleteBuffer(this.colorsBuffer);
            this.colorsBuffer = null;
        }
        if (this.indexBuffer) {
            gl.deleteBuffer(this.indexBuffer);
            this.indexBuffer = null;
        }
        if (this.normalsBuffer) {
            gl.deleteBuffer(this.normalsBuffer);
        }
    }
}