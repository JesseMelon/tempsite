const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //redundant yet safer I guess
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.4, 0.4, 0.4, 1.0);

const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({aspectRatio: canvas.width/canvas.height});

const mesh = new MelonEngine.Mesh(gl, Pyramid.vertices, Pyramid.defaultcolors, Pyramid.indices);
const program = new MelonEngine.ProgramInstance(gl); //default shader invoked (indexed)
const meshInstances = [
    new MelonEngine.MeshInstance(mesh, program, renderer, [0,0,0], [-Math.PI, 0, 0])
]
const numMeshInstances = 16;
for (let i = 0; i < numMeshInstances; i++){
    const angle = Math.PI * 2 / numMeshInstances * i;
    const x = Math.cos(angle) * 3;
    const z = Math.sin(angle) * 3;
    meshInstances.push(new MelonEngine.MeshInstance(mesh,program,renderer,[x, 0, z], [0, Math.PI / 2 - angle, 0]));
}
console.log(meshInstances[0]);
function draw(time = 0) {
    scale = Math.sin(time / 1000) * 0.25 + 1
    meshInstances[0].setScale([scale, scale, scale]);
    camera.setPosition(menu.cameraPosition.x.value, menu.cameraPosition.y.value, menu.cameraPosition.z.value);
    renderer.render(gl, camera);

    window.requestAnimationFrame(draw);
}

draw();