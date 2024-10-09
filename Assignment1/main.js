const funTetrahedronColors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,  // Red
    0.0, 1.0, 0.0, 1.0, // Green
    0.0, 0.0, 1.0, 1.0, // Blue
    1.0, 1.0, 0.0, 1.0 // Yellow
]);

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
//TODO use gl.viewport for dynamic sizing or something (seems easy)
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//one renderer for one scene, one camera for render for this usage
const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({aspectRatio: canvas.width/canvas.height});
// Create objects
const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.defaultcolors, Cube.indices);
const tetraMesh = new MelonEngine.Mesh(gl, Pyramid.vertices, funTetrahedronColors, Pyramid.indices)
const programInstance = new MelonEngine.ProgramInstance(gl); //default shader invoked (indexed)
const cubeInstance = new MelonEngine.MeshInstance(cubeMesh, programInstance, renderer, [-1.5, 1, -1], [0, 0, 0], [1, 1, 1]);
const cubeInstance2 = new MelonEngine.MeshInstance(cubeMesh, programInstance, renderer, [1.5, 1, -1], [0,0,0], [1,1,1]);
const tetraInstance = new MelonEngine.MeshInstance(tetraMesh, programInstance, renderer, [-1.5,-1,-1], [0,0,0], [1.25,1.25,1.25]);
const tetraInstance2 = new MelonEngine.MeshInstance(tetraMesh, programInstance, renderer, [1.5,-1,-1], [0,0,0], [1.25,1.25,1.25]);

//2 meshes, one program, 4 instances, how do ya like them apples.

let angle = 0.015;
// Render loop
function render() {
    cubeInstance.rotateY(angle);
    cubeInstance.rotateZ(-angle);
    cubeInstance2.rotateX(angle);
    cubeInstance2.rotateZ(angle);
    tetraInstance.rotateY(angle);
    tetraInstance.rotateX(angle)
    tetraInstance2.rotateY(-angle);
    tetraInstance2.rotateZ(angle);

    renderer.render(gl, camera);
    requestAnimationFrame(render);
}

// Start rendering
render();