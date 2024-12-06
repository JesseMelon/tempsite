const canvas = document.querySelector('canvas');
const gl = initCanvas(canvas);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.4, 0.4, 0.4, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const scene = new MelonEngine.Scene();
const camera = new MelonEngine.Camera(scene, {position: [0, 4, 10], target: [0,0,0]});//31
const renderer = new MelonEngine.Renderer(camera);

const customShader = new MelonEngine.ShaderComponent()

const cubeMesh = new MelonEngine.Mesh(gl, 
    [
        MelonEngine.Mesh.AttributeType.POSITION,
        MelonEngine.Mesh.AttributeType.VCOLORRGBA
    ], 
    {arrays: [Cube.vertices, Cube.colors]})

// const program = new MelonEngine.ProgramInstance(gl,
//     [

//     ]
// );