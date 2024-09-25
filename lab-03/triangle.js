

class Triangle{
    constructor(gl, vsText, fsText, vertexData = null) {

        this.gl = gl;
        this.position = glMatrix.vec2.fromValues(0, 0);
        this.scale = 1.0;

        // Use the provided vertex data
        this.vertexData = vertexData || new Float32Array(
            [
            Math.cos(glMatrix.glMatrix.toRadian(90)), Math.sin(glMatrix.glMatrix.toRadian(90)), 1, 0, 0, // Red
            Math.cos(glMatrix.glMatrix.toRadian(210)), Math.sin(glMatrix.glMatrix.toRadian(210)), 0, 1, 0, // Green
            Math.cos(glMatrix.glMatrix.toRadian(330)), Math.sin(glMatrix.glMatrix.toRadian(330)), 0, 0, 1  // Blue
        ]);

        this.program = this.createProgram(gl, vsText, fsText);

        // Query for attribute locations
        this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
        this.aColor = gl.getAttribLocation(this.program, 'aColor');
        this.uScale = gl.getUniformLocation(this.program, 'uScale');
        this.uPosition = gl.getUniformLocation(this.program, 'uPosition');

        // Create buffer and fill it with vertex data
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    }

    createProgram(gl, vsSource, fsSource) {
        // Compile vertex shader
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error('Vertex shader failed to compile: ', gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        // Compile fragment shader
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error('Fragment shader failed to compile: ', gl.getShaderInfoLog(fs));
            gl.deleteShader(fs);
            return null;
        }

        // Create and link program
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

    /**
     * @param {WebGL2RenderingContext} gl
     */
    draw() {
        const gl = this.gl;

        gl.useProgram(this.program);

        // Bind buffer and set up attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 5 * 4, 0 * 4);
        gl.vertexAttribPointer(this.aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

        gl.enableVertexAttribArray(this.aPosition);
        gl.enableVertexAttribArray(this.aColor);

        // Send uniform data
        gl.uniform1f(this.uScale, this.scale);
        gl.uniform2fv(this.uPosition, this.position);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}