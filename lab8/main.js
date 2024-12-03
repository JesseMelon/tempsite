const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
const cubeTextureImage = document.getElementById('cubeTexture');

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.25, 0.25, 0.25, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

const scene = new MelonEngine.Scene();
const camera = new MelonEngine.Camera(scene, {position: [0, 0, 2.25], aspectRatio: canvas.width/canvas.height});
const renderer = new MelonEngine.Renderer(camera);

const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.normalIndices, {uvs: Cube.uvs, texture: cubeTextureImage});
const programInstance = new MelonEngine.ProgramInstance(gl,{uvs: true}); //invokes default mode with uvs
const cube = new MelonEngine.MeshInstance(scene, cubeMesh, programInstance, renderer, {unique: true}); 

function draw(time = 0) {

    if (menu.rotateX.checked) cube.transform.rotateX(0.0056);//cube.rotation.x += 0.0056;
    if (menu.rotateY.checked) cube.transform.rotateY(0.0064);//cube.rotation.y += 0.0064;
    if (menu.rotateZ.checked) cube.transform.rotateZ(0.0048);//cube.rotation.z += 0.0048;

    cube.setUVOffset(menu.xOffset.valueAsNumber || 0, menu.yOffset.valueAsNumber || 0);
    cube.setUVScale(menu.xScale.valueAsNumber || 1, menu.yScale.valueAsNumber || 1);

    renderer.render(gl);
    window.requestAnimationFrame(draw);
}

draw();

