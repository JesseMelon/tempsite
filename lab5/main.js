const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.6, 0.6, 0.6, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const scene = new MelonEngine.Scene(2);
const camera = new MelonEngine.Camera(scene,{aspectRatio: canvas.width/canvas.height});
const renderer = new MelonEngine.Renderer(camera);
const pyramidMesh = new MelonEngine.Mesh(gl, Pyramid.vertices, Pyramid.indices, {colors: Pyramid.defaultcolors});
const programInstance = new MelonEngine.ProgramInstance(gl); //invokes default mode
const pyramid = new MelonEngine.MeshInstance(scene, pyramidMesh, programInstance, renderer);

function draw(time = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pyramid.transform.setTransform(
        vec3FromSliders(menu.position),
        vec3ToRadians(vec3FromSliders(menu.rotation)),
        vec3FromSliders(menu.scale)
    );
    renderer.render(gl, camera);
    window.requestAnimationFrame(draw);
}
draw();