MelonEngine.Mesh = class { //overwrite for different configs, this is configured for defaultprogram
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - context
     * @param {MelonEngine.Mesh.AttributeType[]} attribTypes -type of each array in mesh, ordered  
     * @param {Float32Array} vertices - vertex positions
     * @param {Uint16Array} indices - vertex indices
     * @param {Float32Array} [normals] - vertex normals (optional)
     * @param {Float32Array} [colors] - vertex colors (optional)
     * @param {Float32Array} [uvs] - texcoords (optional)
     * @param {WebGLTexture} [texture] -texture (required if uvs are included);
     */
    constructor(gl, attribTypes, {arrays = null, mesh = null, indices = null}){
        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ibo = null;
        this.attribTypes = attribTypes;
        if (attribTypes.length != arrays.length){
            throw new Error("type / array mismatch, must have a type for each array")
        }

        //reorder types here (so they get bound to shader properly)

        if (mesh) { //if a mesh is provided we will disregard any other arrays and set up the VAO
            this.importMesh();
        } else if (arrays) {
            this.buildFromArrays(gl, arrays, attribTypes, indices);
        }else {
            throw new Error("arrays or a mesh required");
        }
    }
    buildFromArrays(gl, arrays, types, indices = null){ //pass array types in corresponding order to how their shaderComponents are ordered
        
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
        
        for (let i = 0; i < arrays.length; i++){
            if (arrays[i].length/types[i].size != vertexCount){
                throw new Error("array size error, ${types[i]} array must have ${vertexCount} elements of size ${types[i].size}")
            }
        }

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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
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
    }
    importMesh(gl){

    }
    bind(gl){ 
        gl.bindVertexArray(this.vao);
    }
    cleanup(gl) {
        //not implemented
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