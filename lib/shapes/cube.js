class Cube {
    static vertices = new Float32Array([
        -0.5, -0.5,  0.5, // Bottom-left
         0.5, -0.5,  0.5, // Bottom-right
         0.5,  0.5,  0.5, // Top-right
        -0.5,  0.5,  0.5, // Top-left
        -0.5, -0.5, -0.5, // Bottom-left
         0.5, -0.5, -0.5, // Bottom-right
         0.5,  0.5, -0.5, // Top-right
        -0.5,  0.5, -0.5, // Top-left
    ]);
    static defaultcolors = new Float32Array([
        1, 0, 0, 1, // Red
        0, 1, 0, 1, // Green
        0, 0, 1, 1, // Blue
        1, 1, 0, 1, // Yellow
        1, 0, 1, 1, // Magenta
        0, 1, 1, 1, // Cyan
        1, 1, 1, 1, // White
        0, 0, 0, 1, // Black
    ]);
    static indices = new Uint16Array([
        0, 1, 2, 0, 2, 3, // front face
        4, 6, 5, 4, 7, 6,// Back face
        4, 5, 1, 4, 1, 0,// Left face
        1, 5, 6, 1, 6, 2,// Right face
        3, 2, 6, 3, 6, 7,// Top face
        4, 0, 3, 4, 3, 7// Bottom face
    ]);
}
