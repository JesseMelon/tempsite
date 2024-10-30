const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.4, 0.4, 0.4, 1.0);

const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({aspectRatio: canvas.width/canvas.height});

const cubeMesh = new MelonEngine.Mesh(gl, NormalsCube.vertices, NormalsCube.colors, NormalsCube.indices, NormalsCube.normals);
const icosphereMesh = new MelonEngine.Mesh(gl, Icosphere.vertices, Icosphere.darkGrey, Icosphere.indices, Icosphere.normals);
const torusMesh = new MelonEngine.Mesh(gl, torusMeshData.vertices, torusMeshData.colors, torusMeshData.indices, torusMeshData.normals);
const program = new MelonEngine.ProgramInstance(gl);
const programInstance = new MelonEngine.ProgramInstance(gl,{normals: true}); //invokes default mode with normals
const litCube = new MelonEngine.MeshInstance(cubeMesh, programInstance, renderer, [-0.5, 0, 0.5], [0, 0, 0], [0.7, 0.7, 0.7]);
const litIcosphere = new MelonEngine.MeshInstance(icosphereMesh, programInstance, renderer,  [0.5, 0, 0.5], [0, 0, 0], [0.3, 0.3, 0.3])
const litTorus = new MelonEngine.MeshInstance(torusMesh, programInstance, renderer, [0, 0, -1], [0,0,0], [0.5, 0.5, 0.5]);
const scene = new MelonEngine.SceneLighting(gl);
const light0 = new MelonEngine.Light(gl, scene, [0,-1,0], [0.7,0.7,0.7]);
const light1 = new MelonEngine.Light(gl, scene, [0,0,1], [1,0,0]);
const light2 = new MelonEngine.Light(gl, scene, [0,0,-1], [0,0,1]);
const light3 = new MelonEngine.Light(gl, scene, [0,1,0], [0,1,0]);

let angle = 0.015;
function draw(time = 0) {

    camera.setPosition(menu.cameraPosition.x.value, menu.cameraPosition.y.value, menu.cameraPosition.z.value);
    light0.setPosition(gl, menu.lightPosition.x.value, menu.lightPosition.y.value, menu.lightPosition.z.value);

    renderer.render(gl, camera, scene);
    litCube.rotateY(angle);
    litCube.rotateX(angle/2);
    litCube.rotateZ(angle/2);
    litIcosphere.rotateY(angle/2);
    litTorus.rotateX(angle/4);
    window.requestAnimationFrame(draw);
}

draw();