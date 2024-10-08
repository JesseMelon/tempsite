// Define vertices, colors, and indices for a cube
const vertices = new Float32Array([
    -1, -1,  1, // 0
     1, -1,  1, // 1
     1,  1,  1, // 2
    -1,  1,  1, // 3
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

// Create WebGL context
const canvas = document.querySelector('canvas');

//TODO should maybe make this a function in MelonEngine
const gl = initCanvas(canvas);
//TODO use gl.viewport for dynamic sizing or something (seems easy)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//one renderer for one scene, one camera for render for this usage
const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({aspectRatio: canvas.width/canvas.height});
// Create objects
const cubeMesh = new MelonEngine.Mesh(gl, vertices, colors, indices);
const programInstance = new MelonEngine.ProgramInstance(gl); //default shaders invoked
const cubeInstance = new MelonEngine.MeshInstance(cubeMesh, programInstance, renderer, [0, 0, 0], [0, 0, 0], [1, 1, 1]);



let angle = 0;
// Render loop
function render() {
    angle += 0.015
    cubeInstance.updateModelMatrix([0,0,0], [0,angle,0],[1,1,1]);
    renderer.render(gl, camera); // Pass a camera instance
    requestAnimationFrame(render);
}

// Start rendering
render();