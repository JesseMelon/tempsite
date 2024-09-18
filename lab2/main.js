import { initCanvas} from '../lib/mv-redux/lib/init/canvas.js';
import { compileShader, linkProgram } from '../lib/mv-redux/lib/init/index.js'
const vertShaderSource = [
    '#version 300 es',
    '',
    'in vec2 aPosition;',
    'in vec3 aColor;',
    'uniform vec2 uOffset;',
    '',
    'out vec3 vColor;',
    '',
    'void main() {',
    '   gl_Position = vec4(aPosition + uOffset, 0, 1);',
    '   vColor = aColor;',
    '}'
].join('\n');

const fragShaderSource = [
    '#version 300 es',
    '',
    'precision mediump float;',
    '',
    'in vec3 vColor;',
    '',
    'out vec4 fColor;',
    '',
    'void main() {',
    '   fColor = vec4(vColor, 1);',
    '}'
].join('\n');

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

// Vertex data
// -------------------------------------------------

const t1Vertices = [
    //    x,     y
    [  0.00,  0.55, 1.0, 0.0, 0.0],
    [ -0.47, -0.27, 0.0, 1.0, 0.0],
    [  0.47, -0.27, 0.0, 0.0, 1.0],
];

const t2Vertices = [
    //    x,     y
    [ -0.21,  0.12, 1.0, 1.0, 1.0],
    [  0.00, -0.25, 0.0, 0.0, 0.0],
    [  0.21,  0.12, 0.0, 0.0, 0.0],
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
const aColor = gl.getAttribLocation(program, 'aColor');
const uOffsetLocation = gl.getUniformLocation(program, "uOffset");

gl.enableVertexAttribArray(aPosition);
gl.enableVertexAttribArray(aColor);

// Create buffers for our two triangles:
const buffer1 = gl.createBuffer();
const buffer2 = gl.createBuffer();

// Drawing
// -------------------------------------------------

// Clear the screen:
gl.clear(gl.COLOR_BUFFER_BIT);



// Prepare our vertices to go to the GPU:
const t1Flattened = t1Vertices.flat();                // array of arrays -> array
const t1VertexData = new Float32Array(t1Flattened);   // convert to raw 32-bit floats instead of JS numbers

const t2VertexData = new Float32Array(t2Vertices.flat());




var angle;
var offset;
var loop = function () {
    angle = performance.now() / 1000 * Math.PI 
    gl.clearColor(1.0,1.0,1.0,1.0)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Draw triangle #1
    // ----------------
    //offset
    offset = Math.sin(angle) * 0.2;
    gl.uniform2f(uOffsetLocation, offset, 0);
    // Set `buffer1` to be the current ARRAY_BUFFER and pass its data:
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, t1VertexData, gl.STATIC_DRAW);
    // Configure the pointer for `aPosition`:
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
    //color
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
    // Draw!
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Draw triangle #2
    // ----------------
    offset = Math.cos(angle) * 0.2;
    gl.uniform2f(uOffsetLocation, 0, offset);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, t2VertexData, gl.STATIC_DRAW);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
