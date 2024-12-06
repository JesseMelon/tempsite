const funTetrahedronColors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,  // Red
    0.0, 1.0, 0.0, 1.0, // Green
    0.0, 0.0, 1.0, 1.0, // Blue
    1.0, 1.0, 0.0, 1.0 // Yellow
]);

const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

//one renderer for one scene, one camera for render for this usage
const scene = new MelonEngine.Scene(10);
const camera = new MelonEngine.Camera(scene, {aspectRatio: canvas.width/canvas.height});
const renderer = new MelonEngine.Renderer(camera);
// Create objects
const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.vertOnlyIndices, {rgbaColors: Cube.defaultcolors});
const tetraMesh = new MelonEngine.Mesh(gl, Pyramid.vertices, Pyramid.indices, {rgbaColors: funTetrahedronColors})
const programInstance = new MelonEngine.ProgramInstance(gl); //default shader invoked (indexed)
const cubeInstance = new MelonEngine.MeshInstance(scene, cubeMesh, programInstance, renderer, {position: [-1.5, 1, -1]});
const cubeInstance2 = new MelonEngine.MeshInstance(scene, cubeMesh, programInstance, renderer, {position: [1.5, 1, -1]});
const tetraInstance = new MelonEngine.MeshInstance(scene, tetraMesh, programInstance, renderer, {position: [-1.5,-1,-1], scale: [1.25,1.25,1.25]});
const tetraInstance2 = new MelonEngine.MeshInstance(scene, tetraMesh, programInstance, renderer, {position: [1.5,-1,-1], scale: [1.25,1.25,1.25]});

//2 meshes, one program, 4 instances, how do ya like them apples.

let angle = 0.015;
// Render loop
function render() {
    cubeInstance.transform.rotateY(angle);
    cubeInstance.transform.rotateZ(-angle);
    cubeInstance2.transform.rotateX(angle);
    cubeInstance2.transform.rotateZ(angle);
    tetraInstance.transform.rotateY(angle);
    tetraInstance.transform.rotateX(angle)
    tetraInstance2.transform.rotateY(-angle);
    tetraInstance2.transform.rotateZ(angle);

    renderer.render(gl, scene);
    requestAnimationFrame(render);
}

// Start rendering
render();