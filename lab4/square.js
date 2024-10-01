class Square {
    position;
    rotation;
    scale;
    color;

    #gl;
    #vao;
    #program;
    #uLocations;

    constructor(gl, options = {}, onReady) {
        this.#gl = gl;

        // Instance properties
        this.color = options.color ? glMatrix.vec4.fromValues(...options.color, 1) : glMatrix.vec4.fromValues(1, 1, 1, 1);
        this.position = options.position ? glMatrix.vec2.fromValues(...options.position) : glMatrix.vec2.fromValues(0, 0);
        this.rotation = options.rotation ?? 0.0;
        this.scale = options.scale ? glMatrix.vec2.fromValues(...options.scale) : glMatrix.vec2.fromValues(1, 1);

        // Load shader source
        loadTextResource('shaders/shape.vert', (vsErr, vsText) => {
            if (vsErr) {
                alert('Fatal error getting vertex shader');
                console.error(vsErr);
            } else {
                loadTextResource('shaders/shape.frag', (fsErr, fsText) => {
                    if (fsErr) {
                        alert('Fatal error getting fragment shader');
                        console.error(fsErr);
                    } else {
                        // Initialize the program after shaders are loaded
                        this.#program = this.initProgram(vsText, fsText);
                        if (this.#program) {
                            this.setProgramData();
                            console.log("Initialized");
                            if (onReady) onReady(); // Call the onReady callback here
                        }
                    }
                });
            }
        });
    }

    setProgramData() {
        const gl = this.#gl;

        this.#uLocations = {
            uPosition: gl.getUniformLocation(this.#program, 'uPosition'),
            uRotation: gl.getUniformLocation(this.#program, 'uRotation'),
            uScale: gl.getUniformLocation(this.#program, 'uScale'),
            uColor: gl.getUniformLocation(this.#program, 'uColor'),
        };

        this.#vao = gl.createVertexArray();
        gl.bindVertexArray(this.#vao);

        const vertexData = new Float32Array([
            -1, +1,  // TL
            -1, -1,  // BL
            +1, +1,  // TR
            +1, +1,  // TR
            -1, -1,  // BL
            +1, -1,  // BR
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

        const aPosition = gl.getAttribLocation(this.#program, 'aPosition');
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        // Done, unbind for now
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    initProgram(vsText, fsText) {
        const gl = this.#gl;

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsText);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error('Vertex shader failed to compile: ', gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsText);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error('Fragment shader failed to compile: ', gl.getShaderInfoLog(fs));
            gl.deleteShader(fs);
            return null;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program failed to link: ', gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    draw() {
        const gl = this.#gl;
        const { uPosition, uScale, uRotation, uColor } = this.#uLocations;

        gl.useProgram(this.#program);
        gl.bindVertexArray(this.#vao);

        gl.uniform2fv(uPosition, this.position);
        gl.uniform2fv(uScale, this.scale);
        gl.uniform1f(uRotation, this.rotation);
        gl.uniform4fv(uColor, this.color);

        gl.drawArrays(gl.TRIANGLES, 0, 6); // 2 triangles = 6 vertices

        gl.bindVertexArray(null);
        gl.useProgram(null);
    }
}
