const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);
const cubeTextureImage = document.getElementById('cubeTexture');

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.25, 0.25, 0.25, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


const renderer = new MelonEngine.Renderer(gl);
const camera = new MelonEngine.Camera({position: [0, 0, 2.25], aspectRatio: canvas.width/canvas.height});

const cubeMesh = new MelonEngine.Mesh(gl, Cube.vertices, Cube.normalIndices, {uvs: Cube.uvs, texture: cubeTextureImage});
const programInstance = new MelonEngine.ProgramInstance(gl,{uvs: true}); //invokes default mode with uvs
const cube = new MelonEngine.MeshInstance(cubeMesh, programInstance, renderer, [0,0,0], [0,0,0], [1,1,1], true);

function draw(time = 0) {

    if (menu.rotateX.checked) cube.rotateX(0.0056); //cube.rotation.x += 0.0056;
    if (menu.rotateY.checked) cube.rotateY(0.0064);//cube.rotation.y += 0.0064;
    if (menu.rotateZ.checked) cube.rotateZ(0.0048);//cube.rotation.z += 0.0048;

    cube.setUVOffset(menu.xOffset.valueAsNumber || 0, menu.yOffset.valueAsNumber || 0);
    cube.setUVScale(menu.xScale.valueAsNumber || 1, menu.yScale.valueAsNumber || 1);

    renderer.render(gl, camera);
    window.requestAnimationFrame(draw);
}

draw();

