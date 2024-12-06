const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.4, 0.4, 0.4, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const scene = new MelonEngine.Scene();
const camera1 = new MelonEngine.Camera(scene, {position: [0, 4, 10], target: [0,0,0]});//31
const renderer = new MelonEngine.Renderer(camera1);  

const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.normalIndices, {rgbaColors: Cube.colors})
const program = new MelonEngine.ProgramInstance(gl, {colorRGBA: true}, {} );

const tankBody = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {sceneName: "tankBody"});//30

const camera2 = new MelonEngine.Camera(scene, {position: [3, 1.5, -0.75], target: [2, 1.5, -0.75], sceneParentName: "tankBody"}); //27
const tankTurret = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {position: [0.5, 0.75, 0], scale: [0.5, 0.5, 0.5], sceneParentName: "tankBody", sceneName: "turret"});//26

const barrelGroup = scene.addGroup({sceneName: "barrel", sceneParentName: "turret"});//25
const tankBarrel = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {position: [-1.5, 0, 0], scale: [2, 0.5, 0.5], sceneParentName: "barrel"})//24

const crateGroup = scene.addGroup({sceneName: "crateGroup"});
const crate1 = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {position: [-4, 1, 0.6], sceneParentName: "crateGroup"});
const crate2 = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {position: [-4, 0, 0], sceneParentName: "crateGroup"});
const crate3 = new MelonEngine.MeshInstance(scene, cubeMesh, program, renderer, {position: [-4.2, 0, 1.1], sceneParentName: "crateGroup"});



function draw(time = 0) {

    renderer.render(gl);
    window.requestAnimationFrame(draw);
}

draw();