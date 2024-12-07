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
    constructor(gl, positions, indices = null, options = {}, mesh = null){
        const { normals = null, uvs = null, rgbaColors = null} = options;

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ibo = null;

        if (mesh) {
            this.importMesh();
        } else {
            let arrays = [positions];
            let types = [MelonEngine.Mesh.AttributeType.POSITION]
            if (normals) {arrays.push(normals); types.push(MelonEngine.Mesh.AttributeType.NORMAL);}
            if (uvs) {arrays.push(uvs); types.push(MelonEngine.Mesh.AttributeType.UV);}
            if (rgbaColors) {arrays.push(rgbaColors); types.push(MelonEngine.Mesh.AttributeType.VCOLORRGBA);}

            this.buildFromArrays(gl, types, arrays, indices);
        }
    }
    buildFromArrays(gl, types, arrays, indices = null){ //pass array types in corresponding order to how their shaderComponents are ordered
        
        //get stride from array of attribute sizes
        let strideElements = 0;
        for (const type of types) {
            strideElements += type.size;
        }
        const stride = strideElements * Float32Array.BYTES_PER_ELEMENT;

        //for each attribute in the order they appear, set up VAO and pack VBO
        //-----------------------------------------------------------------------------------------------
        const vertexCount = arrays[0].length / types[0].size;
        const buffer = new Float32Array(vertexCount * strideElements);
        
        // for (let i = 0; i < arrays.length; i++){
        //     if (arrays[i].length/types[i].size != vertexCount){
        //         throw new Error(`Array size error: ${types[i].name} array must have ${vertexCount} elements of size ${types[i].size}`);
        //     }
        // }

        let offset = 0;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        //for each attribute
        for (let i = 0; i < arrays.length; i++) {
            const size = types[i].size;
            
            //set up pointer in vao
            gl.vertexAttribPointer(i, size, gl.FLOAT, false, stride, offset * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(i);
            
            //pack the vbo
            for (let j = 0; j < vertexCount; j++) {
                buffer.set(arrays[i].slice(j * size, (j + 1) * size), j * strideElements + offset);
            }
            offset += size; //shift indices for next attribute
        }
        //bind complete vbo data 
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        //handle ibo
        if(indices) {
            this.ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this.indexCount = indices.length;
        } else {
            this.ibo = null;
            this.indexCount = 0;
        }

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    //TODO use a bitmask to toggle these ifs 
    bind(gl){ 
        gl.bindVertexArray(this.vao);
        // console.log("ibo binding:");
        // console.log(gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) === this.ibo); // Should log `true`
        return !!this.ibo;
    }
    unbind(gl){
        gl.bindVertexArray(null); // Unbind the VAO
    }
    cleanup(gl) {
        if (this.vao) gl.deleteVertexArray(this.vao);
        if (this.vbo) gl.deleteBuffer(this.vbo);
        if (this.ibo) gl.deleteBuffer(this.ibo);
        this.vao = null;
        this.vbo = null;
        this.ibo = null;
    }
    static AttributeType = {
        POSITION: {order: 0, size: 3},
        NORMAL: {order: 1, size: 3},
        UV: {order: 2, size: 2},
        VCOLORRGB: {order: 3, size: 3},
        VCOLORRGBA: {order: 4, size: 4},
        TANGENT: {order: 5, size: 3},
        BITANGENT: {order: 6, size: 3},
        BONE_INDEX: {order: 7, size: 4},
        BONE_WEIGHT: {order: 8, size: 4},
        CUSTOM0: {order: 9, size: 2 },
        CUSTOM1: {order: 10, size: 3 },
        CUSTOM2: {order: 11, size: 4 },
    }
}