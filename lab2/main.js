//import { compileShader, initCanvas, linkProgram } from 'mv-redux/init';
import vertShaderSource from './shaders/triangle.vert';
import fragShaderSource from './shaders/triangle.frag';

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

// Vertex data
// -------------------------------------------------

const t1Vertices = [
    //    x,     y
    [  0.00,  0.55 ],
    [ -0.47, -0.27 ],
    [  0.47, -0.27 ],
];

const t2Vertices = [
    //    x,     y
    [ -0.21,  0.12 ],
    [  0.00, -0.25 ],
    [  0.21,  0.12 ],
];

// Setup
// -------------------------------------------------

// Configure viewport:
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.7, 0.7, 0.7, 1.0);

// Compile and setup our program:
const vertShader = compileShader(gl, gl.VERTEX_SHADER, vertShaderSource);
const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
const program = linkProgram(gl, vertShader, fragShader);
gl.useProgram(program);

// Ask the program object which ("location") our vertex attributes were assigned and enable them:
const aPosition = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(aPosition);

// Create buffers for our two triangles:
const buffer1 = gl.createBuffer();
const buffer2 = gl.createBuffer();

// Drawing
// -------------------------------------------------

// Clear the screen:
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw triangle #1
// ----------------

// Prepare our vertices to go to the GPU:
const t1Flattened = t1Vertices.flat();                // array of arrays -> array
const t1VertexData = new Float32Array(t1Flattened);   // convert to raw 32-bit floats instead of JS numbers

// Set `buffer1` to be the current ARRAY_BUFFER and pass its data:
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, t1VertexData, gl.STATIC_DRAW);

// Configure the pointer for `aPosition`:
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

// Draw!
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Draw triangle #2
// ----------------

const t2VertexData = new Float32Array(t2Vertices.flat());

gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, t2VertexData, gl.STATIC_DRAW);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 3);
