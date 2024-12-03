MelonEngine.Mesh = class { //overwrite for different configs, this is configured for defaultprogram
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - context
     * @param {Float32Array} vertices - vertex positions
     * @param {Uint16Array} indices - vertex indices
     * @param {Float32Array} [normals] - vertex normals (optional)
     * @param {Float32Array} [colors] - vertex colors (optional)
     * @param {Float32Array} [uvs] - texcoords (optional)
     * @param {WebGLTexture} [texture] -texture (required if uvs are included);
     */
    constructor(gl, vertices, indices, options = {}){
        const { normals = null, colors = null, uvs = null, texture = null } = options;

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.indexCount = indices.length;
        
        this.normalsBuffer = normals ? gl.createBuffer() : null;
        this.colorsBuffer = colors ? gl.createBuffer() : null;
        this.uvsBuffer = uvs ? gl.createBuffer() : null;
        this.textureBuffer = texture? gl.createTexture() : null;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        if (this.colorsBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        }
        if (this.normalsBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        }
        if (this.uvsBuffer && this.textureBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
            gl.bindTexture(gl.TEXTURE_2D, this.textureBuffer);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.generateMipmap(gl.TEXTURE_2D);

        } else if (this.textureBuffer || this.uvsBuffer) {console.error("uvs and texture must both exist")}

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
    //TODO use a bitmask to toggle these ifs 
    bind(gl, program){ //assumes desired compadible program is being used on gl (to be enforced by meshinstance). 

        // Retrieve attribute locations from the program. 
        const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
        //bind the buffers already on the gpu to the attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
        
        if (this.colorsBuffer){
            const colorAttribLocation = gl.getAttribLocation(program, "aColor");
            if (colorAttribLocation !== -1){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
                gl.enableVertexAttribArray(colorAttribLocation);
                gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
            } else { console.warn("Warning: Attribute 'aColor' is not found on program");}
        }
        
        if (this.normalsBuffer) {
            const normalAttribLocation = gl.getAttribLocation(program, "aNormal");
            if (normalAttribLocation !== -1){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
                gl.enableVertexAttribArray(normalAttribLocation);
                gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, false, 0, 0);
            } else { console.warn("Warning: Attribute 'aNormal' is not found on program");}
        }

        if (this.uvsBuffer) {
            const uvAttribLocation = gl.getAttribLocation(program, "aUV");
            if (uvAttribLocation !== -1) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvsBuffer);
                gl.enableVertexAttribArray(uvAttribLocation);
                gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
            } else { console.warn("Warning: Attribute 'aUV' is not found on program");}
            if (this.texture) {
                gl.activeTexture(gl.TEXTURE0); // make tex0 active
                gl.bindTexture(gl.TEXTURE_2D, this.texture); // bind texture to active unit
                const textureUniform = gl.getUniformLocation(program, "uTexture"); // get the uniform in shader 
                gl.uniform1i(textureUniform, 0); //give the uniform the texture in tex0
            }
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        //you can still bind shader specific attributes beyong this. Just call a separate bind function to set up resources not pertaining to mesh data. 
        //this allows mesh to be used with a variety of shaders
        //if additional mesh specific data is required, overwrite mesh class and this bind method instead of binding them separately. 
        //You can also execute these bindings from a child class by calling super within the bind method if your mesh has the same structure basic structure as this default
    }
    cleanup(gl) { //a mesh can be used across multiple instances. TODO make sure ALL instances are finished (refcounted)
        if (this.vertexBuffer) gl.deleteBuffer(this.vertexBuffer);
        if (this.colorsBuffer) gl.deleteBuffer(this.colorsBuffer);
        if (this.normalsBuffer) gl.deleteBuffer(this.normalsBuffer);
        if (this.uvsBuffer) gl.deleteBuffer(this.uvBuffer);
        if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer);
        if (this.texture) gl.deleteTexture(this.texture);
    }
}