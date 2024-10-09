const TIP = 0;
const FRONT = 1;
const LEFT = 2;
const RIGHT = 3;

class Pyramid {
    static vertices = new Float32Array([
        0.0, 0.35, 0.0, // Tip
        Math.cos(glMatrix.glMatrix.toRadian(270)) * 0.5, -0.35, Math.sin(glMatrix.glMatrix.toRadian(270)) * 0.5, // Front
        Math.cos(glMatrix.glMatrix.toRadian(150)) * 0.5, -0.35, Math.sin(glMatrix.glMatrix.toRadian(150)) * 0.5, // Left
        Math.cos(glMatrix.glMatrix.toRadian(30)) * 0.5, -0.35, Math.sin(glMatrix.glMatrix.toRadian(30)) * 0.5  // Right
    ]);

    static defaultcolors = new Float32Array([
        0.00, 0.85, 0.85, // cyan (tip)
        0.85, 0.00, 0.85, // magenta (front)
        0.85, 0.85, 0.00, // yellow (left)
        0.85, 0.85, 0.85  // light gray (right)
    ]);

    static indices = new Uint16Array([
         TIP, FRONT, LEFT,
         TIP, RIGHT, FRONT,
         TIP, LEFT, RIGHT,
         FRONT,  RIGHT, LEFT
    ]);
    
}
