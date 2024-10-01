let isRotating = true;
let square1;
let square2;

function begin() {
    const canvas = document.querySelector('canvas');
    const gl = initCanvas(canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.4, 0.4, 0.4, 1.0);

    square1 = new Square(gl, { color: [1, 0, 0], scale: [0.25, 0.25] }, () => {

        square2 = new Square(gl, { color: [0, 0, 1], scale: [0.15, 0.15] }, () => {
            draw(gl);
        });
    });

    canvas.addEventListener('mousedown', event => {
        if (event.button === 0) { // Check for left mouse button (0)
            // Calculate mouse position relative to canvas
            const rect = canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalize x to range [-1, 1]
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // Normalize y to range [-1, 1]
            
            // Set square2's position to the calculated coordinates
            square2.position[0] = x;
            square2.position[1] = y;
        }
    });

    document.getElementById('rotation').onclick = () => {
        isRotating = !isRotating; // Toggle the rotation flag
        if (isRotating) {
            draw(gl); // Resume drawing if rotating
        }
    };
}

function draw(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    const speedInput = document.getElementById('speed').value;
    const speed = Number(speedInput) || 0;

    square1.rotation += speed * (Math.PI/180);
    square2.rotation -= speed * (Math.PI/180);

    const xSliderValue = Number(document.getElementById('xSlider').value) || 0;
    const ySliderValue = Number(document.getElementById('ySlider').value) || 0;
    square1.position[0] = xSliderValue;
    square1.position[1] = ySliderValue;

    square1.draw();
    square2.draw();

    if (isRotating) {
        window.requestAnimationFrame(() => draw(gl));
    }
}
