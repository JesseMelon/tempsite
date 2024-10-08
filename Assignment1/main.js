// Define vertices, colors, and indices for a cube
const vertices = new Float32Array([
    // Front face
    -1, -1,  1, // 0
     1, -1,  1, // 1
     1,  1,  1, // 2
    -1,  1,  1, // 3
    // Back face
    -1, -1, -1, // 4
     1, -1, -1, // 5
     1,  1, -1, // 6
    -1,  1, -1, // 7
]);

const colors = new Float32Array([
    1, 0, 0, 1, // Red
    0, 1, 0, 1, // Green
    0, 0, 1, 1, // Blue
    1, 1, 0, 1, // Yellow
    1, 0, 1, 1, // Magenta
    0, 1, 1, 1, // Cyan
    1, 1, 1, 1, // White
    0, 0, 0, 1, // Black
]);

const indices = new Uint16Array([
    // Front face
    0, 1, 2, 0, 2, 3,
    // Back face
    4, 6, 5, 4, 7, 6,
    // Left face
    4, 5, 1, 4, 1, 0,
    // Right face
    1, 5, 6, 1, 6, 2,
    // Top face
    3, 2, 6, 3, 6, 7,
    // Bottom face
    4, 0, 3, 4, 3, 7,
]);

// Create WebGL context and initialize the cube
const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
const cubeMesh = new Mesh(gl, vertices, colors, indices);

// Create a ProgramInstance
const programInstance = new ProgramInstance(gl); //default invoked
// Create the renderer and register the cube instance
const rendererI = new renderer(gl);

// Create a MeshInstance for the cube
const cubeInstance = new MeshInstance(cubeMesh, programInstance, rendererI, [0, 0, 0], [0, 0, 0], [1, 1, 1]);

const camera = new Camera();

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

let angle = 0;
// Render loop
function render() {
    angle += 0.015
    cubeInstance.updateModelMatrix([0,0,0], [0,angle,0],[1,1,1]);
    rendererI.render(gl, camera); // Pass a camera instance
    requestAnimationFrame(render);
}

// Start rendering
render();