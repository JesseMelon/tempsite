const vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'   fragTexCoord = vertTexCoord;',
'   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

const fragmentShaderText = 
[
'precision mediump float;',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'void main()',
'{',
'   gl_FragColor = texture2D(sampler, fragTexCoord);',
'}'
].join('\n');


var InitDemo = function(){

    var cubeVerts = new Float32Array(
    [ // X,   Y,   Z,       U, V
        //Top face
        -1.0, 1.0, -1.0,   0, 0,    //0
        -1.0, 1.0, 1.0,    1, 0,    //1
        1.0, 1.0, 1.0,     1, 1,    //2
        1.0, 1.0, -1.0,    0, 1,    //3
        //Left face
        -1.0, 1.0, 1.0,    0, 0,  //4
        -1.0, -1.0, 1.0,   1, 0,  //5
        -1.0, -1.0, -1.0,  1, 1,  //6
        -1.0, 1.0, -1.0,   0, 1,  //7
        //Right face
        1.0, 1.0, 1.0,     1, 1, //8
        1.0, -1.0, 1.0,    0, 1, //9
        1.0, -1.0, -1.0,   0, 0, //10
        1.0, 1.0, -1.0,    1, 0, //11
        //Front face
        1.0, 1.0, 1.0,     1, 1,   //12
        1.0, -1.0, 1.0,    1, 0,   //13
        -1.0, -1.0, 1.0,   0, 0,   //14
        -1.0, 1.0, 1.0,    0, 1,   //15
        //Back face
        1.0, 1.0, -1.0,    0, 0,   //16
        1.0, -1.0, -1.0,   0, 1,   //17
        -1.0, -1.0, -1.0,  1, 1,   //18
        -1.0, 1.0, -1.0,   1, 0,   //19
        //Bottom face
        -1.0, -1.0, -1.0,  1, 1,    //20
        -1.0, -1.0, 1.0,   1, 0,    //21
        1.0, -1.0, 1.0,    0, 0,    //22
        1.0, -1.0, -1.0,   0, 1    //23
    ]);

    var cubeIndices = new Uint16Array(
    [
        //Top
        0, 1, 2,    //0
        0, 2, 3,    //1
        //Left      
        5, 4, 6,    //2
        6, 4, 7,    //3
        //Right
        8, 9, 10,   //4
        8, 10, 11,  //5
        //Front
        13, 12, 14, //6
        15, 14, 12, //7
        //Back
        16, 17, 18, //8
        16, 18, 19, //9
        //Bottom
        21, 20, 22, //10
        22, 20, 23  //11
    ]);

    var viewPosition = [0,0,-5];
    var objPosition = [0,0,0];
    
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("game-surface");
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext('webgl');
    
    if(!gl) {
        console.log('WebGL not supported, falling back on experimental WebGL')
        gl = canvas.getContext('experimental-webgl');
    }
    if (!gl) {
        alert('Your browser does not support WebGL');
    }

    //
    //set canvas clear colour and clear canvas
    //
    gl.clearColor(0.75,0.85,0.8,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //
    //create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //
    //assign source code to shaders
    //
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    //
    //compile shaders & print errors
    //
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling vertex shader.', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error('ERROR compiling fragment shader.', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    //
    //create program
    //
    /** @type {WebGLProgram} */
    var program = gl.createProgram();

    //
    //attach shaders to program
    //
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //
    //link & print errors
    //
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR linking program.', gl.getProgramInfoLog(program));
        return;
    }

    //
    //validate program to catch additional logical errors (debug only)
    //
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validating program.', gl.getProgramInfoLog(program));
        return;
    }

    //
    //use program
    //
    gl.useProgram(program);

    //
    //create and assign vertex and index buffers
    //
    var cubeVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVerts, gl.STATIC_DRAW);
    var cubeIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW)


    //
    //store indices for referencing buffer data
    //
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition'); //'vert position is the symbol associated to to a vec2 attribute in the vertex shader
    // note: positionAttribLocation is the NUMBER in which that attribute occurs. Hence, it is best practice to use the string, or risk mis-indexing.
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    
    //
    //inform GPU of buffer data format
    //
    gl.vertexAttribPointer(
        positionAttribLocation, //index of attribute
        3, //num elements
        gl.FLOAT, //type
        gl.FALSE, //normalized
        5 * Float32Array.BYTES_PER_ELEMENT, //size of element
        0 //offset
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, //index of attribute
        2, //num elements
        gl.FLOAT, //type
        gl.FALSE, //normalized
        5 * Float32Array.BYTES_PER_ELEMENT, //size of element
        3 * Float32Array.BYTES_PER_ELEMENT //offset
    );

    //
    //create texture
    //
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('cat-png'));
    gl.bindTexture(gl.TEXTURE_2D, null);


    //
    //enable arrays. // Why not default?
    //
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);
    
    //
    //set matrices
    //
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, viewPosition, objPosition, [0,1,0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    //
    //cache matrix locations and set matrices gpu
    //
    var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    //
    //Main render loop
    //
    var angle = 0;
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI // 6 seconds per rotation

        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0,1,0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1,0,0]);
        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);

        //glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, UP);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75,0.85,0.8,1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);


};