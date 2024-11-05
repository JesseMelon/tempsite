class Cube {
    static vertices = new Float32Array([
        // Front face
        -0.5, -0.5,  0.5, // Bottom-left
         0.5, -0.5,  0.5, // Bottom-right
         0.5,  0.5,  0.5, // Top-right
        -0.5,  0.5,  0.5, // Top-left

        // Back face
        -0.5, -0.5, -0.5, // Bottom-left
         0.5, -0.5, -0.5, // Bottom-right
         0.5,  0.5, -0.5, // Top-right
        -0.5,  0.5, -0.5, // Top-left

        // Left face
        -0.5, -0.5, -0.5, // Bottom-left
        -0.5, -0.5,  0.5, // Bottom-right
        -0.5,  0.5,  0.5, // Top-right
        -0.5,  0.5, -0.5, // Top-left

        // Right face
         0.5, -0.5, -0.5, // Bottom-left
         0.5, -0.5,  0.5, // Bottom-right
         0.5,  0.5,  0.5, // Top-right
         0.5,  0.5, -0.5, // Top-left

        // Top face
        -0.5,  0.5, -0.5, // Bottom-left
         0.5,  0.5, -0.5, // Bottom-right
         0.5,  0.5,  0.5, // Top-right
        -0.5,  0.5,  0.5, // Top-left

        // Bottom face
        -0.5, -0.5, -0.5, // Bottom-left
         0.5, -0.5, -0.5, // Bottom-right
         0.5, -0.5,  0.5, // Top-right
        -0.5, -0.5,  0.5  // Top-left
    ]);

    static normalIndices = new Uint16Array([
        0, 1, 2, 0, 2, 3, // Front face
        4, 6, 5, 4, 7, 6, // Back face
        8, 9, 10, 8, 10, 11, // Left face
        13, 12, 14, 14, 12, 15, // Right face
        17, 16, 18, 18, 16, 19, // Top face
        20, 21, 22, 20, 22, 23  // Bottom face
    ]);
    
    static vertOnlyIndices = new Uint16Array([
        0, 1, 2, 0, 2, 3, // front face
        4, 6, 5, 4, 7, 6,// Back face
        4, 5, 1, 4, 1, 0,// Left face
        1, 5, 6, 1, 6, 2,// Right face
        3, 2, 6, 3, 6, 7,// Top face
        4, 0, 3, 4, 3, 7// Bottom face
    ]);

    static colors = new Float32Array([
        // Front face (Red)
        0.5, 0, 0, 1, // Bottom-left
        0.5, 0, 0, 1, // Bottom-right
        0.5, 0, 0, 1, // Top-right
        0.5, 0, 0, 1, // Top-left
    
        // Back face (Green)
        0, 0.5, 0, 1, // Bottom-left
        0, 0.5, 0, 1, // Bottom-right
        0, 0.5, 0, 1, // Top-right
        0, 0.5, 0, 1, // Top-left
    
        // Left face (Blue)
        0, 0, 0.5, 1, // Bottom-left
        0, 0, 0.5, 1, // Bottom-right
        0, 0, 0.5, 1, // Top-right
        0, 0, 0.5, 1, // Top-left
    
        // Right face (Yellow)
        0.5, 0.5, 0, 1, // Bottom-left
        0.5, 0.5, 0, 1, // Bottom-right
        0.5, 0.5, 0, 1, // Top-right
        0.5, 0.5, 0, 1, // Top-left
    
        // Top face (Magenta)
        0.5, 0, 0.5, 1, // Bottom-left
        0.5, 0, 0.5, 1, // Bottom-right
        0.5, 0, 0.5, 1, // Top-right
        0.5, 0, 0.5, 1, // Top-left
    
        // Bottom face (Cyan)
        0, 0.5, 0.5, 1, // Bottom-left
        0, 0.5, 0.5, 1, // Bottom-right
        0, 0.5, 0.5, 1, // Top-right
        0, 0.5, 0.5, 1  // Top-left
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

    static lightGrey = new Float32Array([
        // Front face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1, // Top-left
    
        // Back face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1, // Top-left
    
        // Left face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1, // Top-left
    
        // Right face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1, // Top-left
    
        // Top face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1, // Top-left
    
        // Bottom face (Light Gray)
        0.7, 0.7, 0.7, 1, // Bottom-left
        0.7, 0.7, 0.7, 1, // Bottom-right
        0.7, 0.7, 0.7, 1, // Top-right
        0.7, 0.7, 0.7, 1  // Top-left
    ]);

    static darkColors = new Float32Array([
        // Front face (Dark Red)
        0.3, 0, 0, 1, // Bottom-left
        0.3, 0, 0, 1, // Bottom-right
        0.3, 0, 0, 1, // Top-right
        0.3, 0, 0, 1, // Top-left
    
        // Back face (Dark Green)
        0, 0.3, 0, 1, // Bottom-left
        0, 0.3, 0, 1, // Bottom-right
        0, 0.3, 0, 1, // Top-right
        0, 0.3, 0, 1, // Top-left
    
        // Left face (Dark Blue)
        0, 0, 0.3, 1, // Bottom-left
        0, 0, 0.3, 1, // Bottom-right
        0, 0, 0.3, 1, // Top-right
        0, 0, 0.3, 1, // Top-left
    
        // Right face (Dark Yellow)
        0.3, 0.3, 0, 1, // Bottom-left
        0.3, 0.3, 0, 1, // Bottom-right
        0.3, 0.3, 0, 1, // Top-right
        0.3, 0.3, 0, 1, // Top-left
    
        // Top face (Dark Magenta)
        0.3, 0, 0.3, 1, // Bottom-left
        0.3, 0, 0.3, 1, // Bottom-right
        0.3, 0, 0.3, 1, // Top-right
        0.3, 0, 0.3, 1, // Top-left
    
        // Bottom face (Dark Cyan)
        0, 0.3, 0.3, 1, // Bottom-left
        0, 0.3, 0.3, 1, // Bottom-right
        0, 0.3, 0.3, 1, // Top-right
        0, 0.3, 0.3, 1  // Top-left
    ]);

    static normals = new Float32Array([
        0, 0, 1, // Front face
        0, 0, 1, // Front face
        0, 0, 1, // Front face
        0, 0, 1, // Front face

        0, 0, -1, // Back face
        0, 0, -1, // Back face
        0, 0, -1, // Back face
        0, 0, -1, // Back face

        -1, 0, 0, // Left face
        -1, 0, 0, // Left face
        -1, 0, 0, // Left face
        -1, 0, 0, // Left face

        1, 0, 0, // Right face
        1, 0, 0, // Right face
        1, 0, 0, // Right face
        1, 0, 0, // Right face

        0, 1, 0, // Top face
        0, 1, 0, // Top face
        0, 1, 0, // Top face
        0, 1, 0, // Top face

        0, -1, 0, // Bottom face
        0, -1, 0, // Bottom face
        0, -1, 0, // Bottom face
        0, -1, 0  // Bottom face
    ]);

    static uvs = new Float32Array([
        0, 0, //front face
        1, 0,
        1, 1,
        0, 1,

        0, 0, //back face
        1, 0,
        1, 1,
        0, 1, 

        0, 0, //left
        1, 0,
        1, 1,
        0, 1, 

        0, 0, //right
        1, 0,
        1, 1,
        0, 1, 

        0, 0, //top
        1, 0,
        1, 1,
        0, 1, 

        0, 0, //bottom
        1, 0,
        1, 1,
        0, 1, 
    ])
}