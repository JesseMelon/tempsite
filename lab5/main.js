const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.6, 0.6, 0.6, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({aspectRatio: canvas.width/canvas.height});
const pyramidMesh = new MelonEngine.Mesh(gl, Pyramid.vertices, Pyramid.indices, {colors: Pyramid.defaultcolors});
const programInstance = new MelonEngine.ProgramInstance(gl); //invokes default mode
const pyramid = new MelonEngine.MeshInstance(pyramidMesh, programInstance, renderer, [0, 0, 0], [0, 0, 0], [1, 1, 1]);

function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pyramid.setModelMatrix(
        vec3FromSliders(menu.position),
        vec3ToRadians(vec3FromSliders(menu.rotation)),
        vec3FromSliders(menu.scale)
    );
    renderer.render(gl, camera);
    window.requestAnimationFrame(draw);
}
draw();