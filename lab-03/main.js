

function LoadDemo() {
    console.log('Loading Resources');
    loadTextResource('shaders/triangle.vert', function(vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader');
            console.error(vsErr);
        } else {
            loadTextResource('shaders/triangle.frag', function(fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader');
                    console.error(fsErr);
                } else {
                    InitDemo(vsText, fsText);
                }
            });
        }
    });
}

function InitDemo(vsText, fsText) {
    console.log('Initializing');

    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.7, 0.7, 0.7, 1.0);

    // Create Triangle instances
    const t1 = new Triangle(gl, vsText, fsText, new Float32Array ([
        Math.cos(glMatrix.glMatrix.toRadian(45)), Math.sin(glMatrix.glMatrix.toRadian(45)), 1, 1, 0, 
        Math.cos(glMatrix.glMatrix.toRadian(165)), Math.sin(glMatrix.glMatrix.toRadian(165)), 0, 1, 1,
        Math.cos(glMatrix.glMatrix.toRadian(285)), Math.sin(glMatrix.glMatrix.toRadian(285)), 1, 0, 1 
    ]));
    const t2 = new Triangle(gl, vsText, fsText, new Float32Array ([
        Math.cos(glMatrix.glMatrix.toRadian(60)), Math.sin(glMatrix.glMatrix.toRadian(60)), 0.678, 0.847, 0.902,
        Math.cos(glMatrix.glMatrix.toRadian(180)), Math.sin(glMatrix.glMatrix.toRadian(180)), 0.564, 0.933, 0.564,
        Math.cos(glMatrix.glMatrix.toRadian(300)), Math.sin(glMatrix.glMatrix.toRadian(300)), 1.000, 0.828, 0.824 
    ]));
    const t3 = new Triangle(gl, vsText, fsText, null);
    //leave vert data default

    // Animate the triangles
    function draw(time = 0) {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Update and draw triangles
        t1.position = [Math.cos(time / 500) * 0.6, Math.sin(time / 1000) * 0.6];
        t1.scale = Math.random() * 0.05 + 0.2;
        t1.draw(gl);

        t2.position = [Math.cos(time / 1000 + Math.PI/2) * -0.6, Math.sin(time / 750 + Math.PI/2) * -0.6];
        t2.scale = Math.abs(Math.cos(time / 100 + Math.PI) * 0.05 + 0.30);
        t2.draw(gl);

        t3.position = [Math.cos(time / 1000 + Math.PI / 2) * 0.6, Math.sin(time / 1000 + Math.PI / 2) * 0.6];
        t3.scale = Math.cos(time / 1000 + Math.PI / 2) * 0.10 + 0.30;
        t3.draw(gl);

        window.requestAnimationFrame(draw);
    }

    draw();
}

//classless working code

// function LoadDemo(){
//     console.log('Loading Resources');
//     loadTextResource('shaders/triangle.vert', function(vsErr, vsText){
//         if (vsErr) {
//             alert('Fatal error getting vertex shader:');
//             console.error(vsErr);
//         } else {
//             loadTextResource('./shaders/triangle.frag', function (fsErr, fsText) {
//                 if (fsErr) {
//                     alert('Fatal error getting vertex shader:');
//                     console.error(vsErr);
//                 } else {
//                     InitDemo(vsText, fsText);
//                 }
//             });
//         }
//     });
// }

// function InitDemo(vsText, fsText){
//     console.log('Initializing');

//     const canvas = document.querySelector('canvas');
//     const gl = canvas.getContext('webgl2');

//     gl.viewport(0, 0, canvas.width, canvas.height);
//     gl.clearColor(0.7, 0.7, 0.7, 1.0);

//     // Triangle initialization
//     // =================================================================================================

//     let position = glMatrix.vec2.fromValues(0, 0);
//     let scale = 1.00;

//     // Create vertex data (sin and cos to get `x,y` points at 90, 210, 330 degrees around the unit
//     // circle; i.e., an equilateral triangle):

//     const vertexData = new Float32Array([
//         Math.cos(glMatrix.glMatrix.toRadian(90)), Math.sin(glMatrix.glMatrix.toRadian(90)), 1, 0, 0, // Red
//         Math.cos(glMatrix.glMatrix.toRadian(210)), Math.sin(glMatrix.glMatrix.toRadian(210)), 0, 1, 0, // Green
//         Math.cos(glMatrix.glMatrix.toRadian(330)), Math.sin(glMatrix.glMatrix.toRadian(330)), 0, 0, 1  // Blue
//     ]);

//     // Compile vertex shader
//     const vs = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vs, vsText);
//     gl.compileShader(vs);
//     if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
//         console.error('Vertex shader failed to compile: ', gl.getShaderInfoLog(vs));
//         gl.deleteShader(vs);
//         return;
//     }
//     // Compile fragment shader
//     const fs = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fs, fsText);
//     gl.compileShader(fs);
//     if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
//         console.error('Fragment shader failed to compile: ', gl.getShaderInfoLog(fs));
//         gl.deleteShader(fs);
//         return;
//     }
//     //create and link program
//     const program = gl.createProgram();
//     gl.attachShader(program, vs);
//     gl.attachShader(program, fs);
//     gl.linkProgram(program);
//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//         console.error('Program failed to link: ', gl.getProgramInfoLog(program));
//         return;
//     }

//     // Query for attribute & uniform locations
//     const aPosition = gl.getAttribLocation(program, 'aPosition');
//     const aColor = gl.getAttribLocation(program, 'aColor');
//     const uScaleLocation = gl.getUniformLocation(program, 'uScale');
//     const uPositionLocation = gl.getUniformLocation(program, 'uPosition');

//     // Create buffer and fill it with vertex data
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

//     RunDemo(gl, program, buffer, aPosition, aColor, uScaleLocation, uPositionLocation);

// }
// // =================================================================================================

// function RunDemo(gl, program, buffer, aPosition, aColor, uScaleLocation, uPositionLocation){
//     console.log('running');
//     /**
//      * The main draw loop.
//      *
//      * @param {number} time The number of milliseconds that have passed since the page was loaded. This
//      * parameter is passed automatically by `requestAnimationFrame` when it re-calls this function.
//      *
//      * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
//      */
//     function draw(time = 0) {
//         gl.clear(gl.COLOR_BUFFER_BIT);

//         let scale = Math.cos(time / 1000) * 0.25 + 0.50;
//         let position = glMatrix.vec2.fromValues(Math.cos(time / 1000) * 0.6, Math.sin(time / 1000) * 0.6)

//         // Triangle drawing
//         // =============================================================================================
//         gl.useProgram(program);
//         gl.uniform2fv(uPositionLocation, position);
//         gl.uniform1f(uScaleLocation, scale);
        
//         // Bind our buffer and set our attributes
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//         gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * 4, 0 * 4);
//         gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

//         // Make sure they're still enabled
//         gl.enableVertexAttribArray(aPosition);
//         gl.enableVertexAttribArray(aColor);

//         gl.drawArrays(gl.TRIANGLES, 0, 3);

//         // =============================================================================================

//         window.requestAnimationFrame(draw);
//     }

// draw();
// }