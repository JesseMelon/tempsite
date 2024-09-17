import { isVector } from './vec.js';
/**
 * Determines whether or not the given object is a matrix.
 */
export function isMatrix(v) {
    return Array.isArray(v) && (v.type === 'mat4' ||
        v.type === 'mat3' ||
        v.type === 'mat2');
}
export function mat2(...args) {
    const out = [
        [1, 0],
        [0, 1],
    ];
    Object.defineProperty(out, 'type', { value: 'mat2', writable: false, enumerable: false });
    const argError = () => new Error("Invalid arguments passed to 'mat2':\n" +
        "Expected either:\n" +
        "    0 arguments,\n" +
        "    4 numbers,\n" +
        "    1 number,\n" +
        "    1 matrix,\n" +
        "    2 vec2s;\n" +
        `received: (${args.map(x => x.type ?? typeof x).join(', ')})`);
    if (args.length == 0) {
        // Leave as identity
    }
    else if (args.length == 4) {
        for (let i = 0; i < 4; i++) {
            if (typeof args[i] !== 'number')
                throw argError();
        }
        out[0][0] = args[0];
        out[0][1] = args[1];
        out[1][0] = args[2];
        out[1][1] = args[3];
    }
    else if (args.length == 2) {
        const [c0, c1] = args;
        if (!isVector(c0) || !isVector(c1)) {
            throw argError();
        }
        else if (c0.length != 2 || c1.length != 2) {
            throw argError();
        }
        out[0][0] = c0[0];
        out[0][1] = c0[1];
        out[1][0] = c1[0];
        out[1][1] = c1[1];
    }
    else if (args.length == 1) {
        const [m] = args;
        if (typeof m === 'number') {
            out[0][0] = m;
            out[1][1] = m;
        }
        else if (isMatrix(m)) {
            out[0][0] = m[0][0];
            out[0][1] = m[0][1];
            out[1][0] = m[1][0];
            out[1][1] = m[1][1];
        }
        else {
            throw argError();
        }
    }
    else {
        throw argError();
    }
    return out;
}
export function mat3(...args) {
    const out = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
    ];
    Object.defineProperty(out, 'type', { value: 'mat3', writable: false, enumerable: false });
    const argError = () => new Error("Invalid arguments passed to 'mat3':\n" +
        "Expected either:\n" +
        "    0 arguments,\n" +
        "    9 numbers,\n" +
        "    1 number,\n" +
        "    1 matrix, or\n" +
        "    3 vec3s;\n" +
        `received: (${args.map(x => x.type ?? typeof x).join(', ')})`);
    if (args.length == 0) {
        // Leave as identity
    }
    else if (args.length == 9) {
        for (let i = 0; i < 9; i++) {
            if (typeof args[i] !== 'number')
                throw argError();
        }
        out[0][0] = args[0];
        out[0][1] = args[1];
        out[0][2] = args[2];
        out[1][0] = args[3];
        out[1][1] = args[4];
        out[1][2] = args[5];
        out[2][0] = args[6];
        out[2][1] = args[7];
        out[2][2] = args[8];
    }
    else if (args.length == 3) {
        const [c0, c1, c2] = args;
        if (!isVector(c0) || !isVector(c1) || !isVector(c2)) {
            throw argError();
        }
        else if (c0.length != 3 || c1.length != 3 || c2.length != 3) {
            throw argError();
        }
        out[0][0] = c0[0];
        out[0][1] = c0[1];
        out[0][2] = c0[2];
        out[1][0] = c1[0];
        out[1][1] = c1[1];
        out[1][2] = c1[2];
        out[2][0] = c2[0];
        out[2][1] = c2[1];
        out[2][2] = c2[2];
    }
    else if (args.length == 1) {
        const [m] = args;
        if (typeof m === 'number') {
            out[0][0] = m;
            out[1][1] = m;
            out[2][2] = m;
        }
        else if (isMatrix(m)) {
            if (m.type === 'mat4' || m.type == 'mat3') {
                out[0][0] = m[0][0];
                out[0][1] = m[0][1];
                out[0][2] = m[0][2];
                out[1][0] = m[1][0];
                out[1][1] = m[1][1];
                out[1][2] = m[1][2];
                out[2][0] = m[2][0];
                out[2][1] = m[2][1];
                out[2][2] = m[2][2];
            }
            else if (m.type === 'mat2') {
                out[0][0] = m[0][0];
                out[0][1] = m[0][1];
                out[1][0] = m[1][0];
                out[1][1] = m[1][1];
            }
            else {
                throw argError();
            }
        }
        else {
            throw argError();
        }
    }
    else {
        throw argError();
    }
    return out;
}
export function mat4(...args) {
    const out = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    Object.defineProperty(out, 'type', { value: 'mat4', writable: false, enumerable: false });
    const argError = () => new Error("Invalid arguments passed to 'mat4':\n" +
        "Expected either:\n" +
        "    0 arguments,\n" +
        "    16 numbers,\n" +
        "    1 number,\n" +
        "    1 matrix, or\n" +
        "    4 vec4s;\n" +
        `received: (${args.map(x => x.type ?? typeof x).join(', ')})`);
    if (args.length === 0) {
        // Leave as identity
    }
    else if (args.length === 16) {
        for (let i = 0; i < 16; i++) {
            if (typeof args[i] !== 'number')
                throw argError();
        }
        out[0][0] = args[0];
        out[0][1] = args[1];
        out[0][2] = args[2];
        out[0][3] = args[3];
        out[1][0] = args[4];
        out[1][1] = args[5];
        out[1][2] = args[6];
        out[1][3] = args[7];
        out[2][0] = args[8];
        out[2][1] = args[9];
        out[2][2] = args[10];
        out[2][3] = args[11];
        out[3][0] = args[12];
        out[3][1] = args[13];
        out[3][2] = args[14];
        out[3][3] = args[15];
    }
    else if (args.length === 4) {
        const [c0, c1, c2, c3] = args;
        if (!isVector(c0) || !isVector(c1) || !isVector(c2) || !isVector(c3)) {
            throw argError();
        }
        else if (c0.length != 4 || c1.length != 4 || c2.length != 4 || c3.length != 4) {
            throw argError();
        }
        out[0][0] = c0[0];
        out[0][1] = c0[1];
        out[0][2] = c0[2];
        out[0][3] = c0[3];
        out[1][0] = c1[0];
        out[1][1] = c1[1];
        out[1][2] = c1[2];
        out[1][3] = c1[3];
        out[2][0] = c2[0];
        out[2][1] = c2[1];
        out[2][2] = c2[2];
        out[2][3] = c2[3];
        out[3][0] = c3[0];
        out[3][1] = c3[1];
        out[3][2] = c3[2];
        out[3][3] = c3[3];
    }
    else if (args.length === 1) {
        const [m] = args;
        if (typeof m === 'number') {
            out[0][0] = m;
            out[1][1] = m;
            out[2][2] = m;
            out[3][3] = m;
        }
        else if (isMatrix(m)) {
            if (m.type === 'mat4') {
                out[0][0] = m[0][0];
                out[0][1] = m[0][1];
                out[0][2] = m[0][2];
                out[0][3] = m[0][3];
                out[1][0] = m[1][0];
                out[1][1] = m[1][1];
                out[1][2] = m[1][2];
                out[1][3] = m[1][3];
                out[2][0] = m[2][0];
                out[2][1] = m[2][1];
                out[2][2] = m[2][2];
                out[2][3] = m[2][3];
                out[3][0] = m[3][0];
                out[3][1] = m[3][1];
                out[3][2] = m[3][2];
                out[3][3] = m[3][3];
            }
            else if (m.type === 'mat3') {
                out[0][0] = m[0][0];
                out[0][1] = m[0][1];
                out[0][2] = m[0][2];
                out[1][0] = m[1][0];
                out[1][1] = m[1][1];
                out[1][2] = m[1][2];
                out[2][0] = m[2][0];
                out[2][1] = m[2][1];
                out[2][2] = m[2][2];
            }
            else if (m.type === 'mat2') {
                out[0][0] = m[0][0];
                out[0][1] = m[0][1];
                out[1][0] = m[1][0];
                out[1][1] = m[1][1];
            }
            else {
                throw argError();
            }
        }
        else {
            throw argError();
        }
    }
    else {
        throw argError();
    }
    return out;
}
//# sourceMappingURL=mat.js.map