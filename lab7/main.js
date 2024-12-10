const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.clearColor(0.4, 0.4, 0.4, 1.0);

const scene = new MelonEngine.Scene();
const camera = new MelonEngine.Camera(scene, {aspectRatio: canvas.width/canvas.height});
const renderer = new MelonEngine.Renderer(camera);

const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.normalIndices, {normals: Cube.normals});
const icosphereMesh = new MelonEngine.Mesh(gl, Icosphere.vertices, Icosphere.indices, {normals: Icosphere.normals});
const torusMesh = new MelonEngine.Mesh(gl, torusMeshData.vertices, torusMeshData.indices, {normals: torusMeshData.normals});
const programInstance = new MelonEngine.ProgramInstance(gl, {normals: false}, {blinnPhong: false, material: false} ) //invokes default mode with normals
const materialInstance = new MelonEngine.Material(gl, {ambientColor: [0.87, 0.67, 0.3], diffuseColor: [1, 0.7, 0.12], specularColor: [1, 0.87, 0], shine: 0.6});
const litCube = new MelonEngine.MeshInstance(scene, cubeMesh, programInstance, renderer, {position: [-0.5, 0, 0.5], scale: [0.7, 0.7, 0.7], material: materialInstance});
const litIcosphere = new MelonEngine.MeshInstance(scene, icosphereMesh, programInstance, renderer,{position: [0.5, 0, 0.5], scale: [0.3, 0.3, 0.3], material: materialInstance})
const litTorus = new MelonEngine.MeshInstance(scene, torusMesh, programInstance, renderer, {position: [0, 0, -1], scale: [0.5, 0.5, 0.5], material: materialInstance});
const sceneLighting = new MelonEngine.SceneLighting(gl);
const light0 = new MelonEngine.Light(gl, sceneLighting, {position: [0,-1,0], ambientColor: [0.7,0.7,0.7], diffuseColor: [0.7,0.7,0.7], specularColor: [0.7,0.7,0.7]});
const light1 = new MelonEngine.Light(gl, sceneLighting, {position: [0,0,1], ambientColor: [1,0,0], diffuseColor: [1,0,0], specularColor: [1,0,0]});
const light2 = new MelonEngine.Light(gl, sceneLighting, {position: [0,0,-1], ambientColor: [0,0,1], diffuseColor: [0,0,1], specularColor: [0,0,1]});
const light3 = new MelonEngine.Light(gl, sceneLighting, {position: [0,1,0], ambientColor: [0,1,0], diffuseColor: [0,1,0], specularColor: [0,1,0]});

let angle = 0.015;
function draw(time = 0) {

    camera.repositionAroundTarget([menu.cameraPosition.x.value, menu.cameraPosition.y.value, menu.cameraPosition.z.value], [0,0,0], [0,1,0]);
    light0.setPosition(gl, [menu.lightPosition.x.value, menu.lightPosition.y.value, menu.lightPosition.z.value]);

    renderer.render(gl, sceneLighting);
    litCube.transform.rotateY(angle);
    litCube.transform.rotateX(angle/2);
    litCube.transform.rotateZ(angle/2);
    litIcosphere.transform.rotateY(angle/2);
    litTorus.transform.rotateX(angle/4);
    window.requestAnimationFrame(draw);
}

draw();