const MelonEngine = {
    const : { mat3, mat4, vec3 } = glMatrix

}

MelonEngine.padMat3ToMat4 = function(mat3) {
    if (mat3.length !== 9) {
        throw new Error("Input must be a 9-element array representing a mat3.");
    }

    // Create a 16-element array for the mat4 (padded)
    let mat4 = new Float32Array(16);

    // Copy the 3x3 matrix elements into the 4x4 matrix (std140 requires padding)
    mat4[0] = mat3[0];  
    mat4[1] = mat3[1];  
    mat4[2] = mat3[2];  
    mat4[3] = 0.0;      

    mat4[4] = mat3[3];  
    mat4[5] = mat3[4];  
    mat4[6] = mat3[5];  
    mat4[7] = 0.0;     

    mat4[8] = mat3[6];  
    mat4[9] = mat3[7];  
    mat4[10] = mat3[8]; 
    mat4[11] = 0.0;     

    mat4[12] = 0.0;     
    mat4[13] = 0.0;     
    mat4[14] = 0.0;     
    mat4[15] = 1.0;    

    return mat4;
}
