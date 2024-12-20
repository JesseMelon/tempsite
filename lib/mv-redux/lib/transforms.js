import { isVector, vec3 } from './vec.js';
import { isMatrix, mat3, mat4 } from './mat.js';
import { radians, sub, dot, cross, normalize, inverse, transpose } from './ops.js';
export function translationMatrix(arg0, arg1, arg2) {
    let x, y, z;
    if (isVector(arg0) && arg0.type === 'vec3' && arg1 === undefined && arg2 === undefined) {
        [x, y, z] = arg0;
    }
    else if (typeof arg0 === 'number' && typeof arg1 === 'number' && typeof arg2 === 'number') {
        x = arg0;
        y = arg1;
        z = arg2;
    }
    else {
        // Error case
        const type0 = arg0?.type ?? typeof arg0;
        const type1 = arg1?.type ?? typeof arg1;
        const type2 = arg2?.type ?? typeof arg2;
        const received = [type0, type1, type2].filter(s => s).join(', ');
        throw new Error("Invalid arguments passed to 'translationMatrix':\n" +
            `Expected a 2D or 3D position, either as numbers or as a single vector; received (${received}).`);
    }
    return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
}
export function rotationMatrix(axis, angle) {
    if (typeof angle !== 'number') {
        const thetaType = angle?.type ?? typeof angle;
        throw new Error("Invalid argument passed to 'rotationMatrix':\n" +
            `Expected 'theta' to be a number, received (${thetaType}).`);
    }
    const sin = Math.sin(radians(angle));
    const cos = Math.cos(radians(angle));
    if (typeof axis === 'string') {
        switch (axis.toLowerCase()) {
            case 'x': return mat4(1.0, 0.0, 0.0, 0.0, 0.0, cos, sin, 0.0, 0.0, -sin, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
            case 'y': return mat4(cos, 0.0, -sin, 0.0, 0.0, 1.0, 0.0, 0.0, sin, 0.0, cos, 0.0, 0.0, 0.0, 0.0, 1.0);
            case 'z': return mat4(cos, sin, 0.0, 0.0, -sin, cos, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
        }
    }
    else if (isVector(axis) && axis.type === 'vec3') {
        const [x, y, z] = normalize(axis);
        const omc = 1.0 - cos; // "one minus cosine"
        return mat4((cos + x * x * omc), (x * y * omc - z * sin), (x * z * omc + y * sin), 0.0, (y * x * omc + z * sin), (cos + y * y * cos), (y * z * omc - x * sin), 0.0, (z * x * omc - y * sin), (z * y * omc + x * sin), (cos + z * z * omc), 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    const axisType = axis?.type ?? typeof axis;
    const angleType = angle?.type ?? typeof angle;
    throw new Error("Invalid arguments passed to 'rotationMatrix':\n" +
        `Expected an axis ('x', 'y', 'z', or a vec3) and an angle; received (${axisType}, ${angleType}).`);
}
export function scaleMatrix(arg0, arg1, arg2) {
    let x, y, z;
    if (typeof arg0 === 'number' && arg1 === undefined && arg2 === undefined) {
        x = y = z = arg0;
    }
    else if (typeof arg0 === 'number' && typeof arg1 === 'number' && typeof arg2 === 'number') {
        x = arg0;
        y = arg1;
        z = arg2;
    }
    else if (isVector(arg0) && arg0.type === 'vec3') {
        [x, y, z] = arg0;
    }
    else {
        // Error case
        const type0 = arg0?.type ?? typeof arg0;
        const type1 = arg1?.type ?? typeof arg1;
        const type2 = arg2?.type ?? typeof arg2;
        const received = [type0, type1, type2].filter(s => s).join(', ');
        throw new Error("Invalid arguments passed to 'scaleMatrix':\n" +
            `Expected a uniform or per-axis scale, either as numbers or as a single vector; received (${received}).`);
    }
    return mat4(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
}
// -------------------------------------------------------------------------------------------------
/**
 * Constructs a _look-at matrix;_ a model–view matrix that will reposition points in 3D space such
 * that the visible points mimic the viewport of a virtual camera.
 * @param eyePosition The position of the virtual camera.
 * @param target Where in space the virtual camera should point.
 * @param upVec A unit-vector which describes a direction. The virtual camera is oriented such that
 * "up" on the screen, from its perspective, aligns with this direction. Defaults to `(0, 1, 0)`;
 * upwards along the Y-axis.
 */
export function lookAtMatrix(eyePosition, target, upVec = vec3(0, 1, 0)) {
    if (isVector(eyePosition) && eyePosition.type === 'vec3' &&
        isVector(target) && target.type === 'vec3' &&
        isVector(upVec) && upVec.type === 'vec3') {
        // Compute the new axes that our camera's coordinate space contains
        const zAxis = normalize(sub(target, eyePosition));
        const xAxis = normalize(cross(zAxis, upVec));
        const yAxis = cross(xAxis, zAxis); // norm × norm = norm
        // Negate Z to go from left-handed to right-handed coordinate system
        zAxis[0] = -zAxis[0];
        zAxis[1] = -zAxis[1];
        zAxis[2] = -zAxis[2];
        // Figure out how far away to move everything else
        const xTrans = -dot(xAxis, eyePosition);
        const zTrans = -dot(zAxis, eyePosition);
        const yTrans = -dot(yAxis, eyePosition);
        return mat4(xAxis[0], yAxis[0], zAxis[0], 0, xAxis[1], yAxis[1], zAxis[1], 0, xAxis[2], yAxis[2], zAxis[2], 0, xTrans, yTrans, zTrans, 1);
    }
    const cType = eyePosition?.type ?? typeof eyePosition;
    const tType = target?.type ?? typeof target;
    const uType = upVec?.type ?? typeof upVec;
    throw new Error("Invalid arguments passed to 'lookAtMatrix':\n" +
        `Expected three 3D vectors, received (${cType}, ${tType}, ${uType}).`);
}
// -------------------------------------------------------------------------------------------------
/**
 * Constructs a _perspective projection matrix._
 * @param fovY The desired **vertical** field-of-view.
 * @param aspectRatio The ratio of the screen's width to its height.
 * @param near The near clipping-plane's distance from the camera. Anything closer than this
 * distance will be cut off.
 * @param far The far clipping-plane's distance from the camera. Anything further than this distance
 * will not be visible.
 *
 * @see {@link https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-introduction.html}
 */
export function perspectiveMatrix(fovY, aspectRatio, near, far) {
    if (typeof fovY !== 'number' ||
        typeof aspectRatio !== 'number' ||
        typeof near !== 'number' ||
        typeof far !== 'number') {
        const fovType = fovY?.type ?? typeof fovY;
        const aspectType = aspectRatio?.type ?? typeof aspectRatio;
        const nearType = near?.type ?? typeof near;
        const farType = far?.type ?? typeof far;
        throw new Error("Invalid arguments passed to 'perspectiveMatrix':\nExpected four numbers, received " +
            `(${fovType}, ${aspectType}, ${nearType}, ${farType})`);
    }
    const fov = 1 / Math.tan(radians(fovY) / 2);
    const depth = far - near;
    const result = mat4();
    result[0][0] = fov / aspectRatio;
    result[1][1] = fov;
    result[2][2] = -(near + far) / depth;
    result[2][3] = -2 * near * far / depth;
    result[3][2] = -1;
    result[3][3] = 0;
    return result;
}
// -------------------------------------------------------------------------------------------------
/**
 * Constructs an _orthographic projection matrix_.
 *
 * @see {@link https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix.html}.
 */
export function orthographicMatrix(left, right, bottom, top, near, far) {
    if (typeof left !== 'number' ||
        typeof right !== 'number' ||
        typeof bottom !== 'number' ||
        typeof top !== 'number' ||
        typeof near !== 'number' ||
        typeof far !== 'number') {
        const lType = left?.type ?? typeof left;
        const rType = right?.type ?? typeof right;
        const bType = bottom?.type ?? typeof bottom;
        const tType = top?.type ?? typeof top;
        const nType = near?.type ?? typeof near;
        const fType = far?.type ?? typeof far;
        throw new Error("Invalid arguments passed to 'orthographicMatrix':\nExpected six numbers, received " +
            `(${lType}, ${rType}, ${bType}, ${bType}, ${tType}, ${nType}, ${fType}).`);
    }
    const width = right - left;
    const height = top - bottom;
    const depth = far - near;
    const result = mat4();
    result[0][0] = 2.0 / width;
    result[1][1] = 2.0 / height;
    result[2][2] = -2.0 / depth;
    result[0][3] = -(left + right) / width;
    result[1][3] = -(top + bottom) / height;
    result[2][3] = -(near + far) / depth;
    return result;
}
export function normalMatrix(m, asMat3 = false) {
    if (isMatrix(m) && (m.type === 'mat4' || m.type === 'mat3')) {
        if (asMat3)
            m = mat3(m);
        return inverse(transpose(m));
    }
    const mType = m?.type ?? typeof m;
    throw new Error("Invalid argument passed to 'normalMatrix':\n" +
        `Expected a 4D matrix, received ${mType}.`);
}
// -------------------------------------------------------------------------------------------------
// Backwards-compatible aliases
/**
 * Creates a translation matrix.
 *
 * @deprecated This function has been replaced with {@linkcode translationMatrix}, which accepts
 * more versatile inputs.
 */
export function translate(x, y, z) {
    return translationMatrix(x, y, z);
}
export function rotate(...args) {
    if (args.length === 2) {
        // We let this function do the error checking. Note that the old version takes angle first.
        return rotationMatrix(args[1], args[0]);
    }
    else if (args.length === 4) {
        const axis = vec3(args[1], args[2], args[3]);
        return rotationMatrix(axis, args[0]);
    }
    else {
        // @ts-ignore We just toss all their arguments into the main function and let it do
        // error-handling.
        return rotationMatrix(...args);
    }
}
/**
 * Constructs a rotation matrix that will rotate things around the X-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export function rotateX(theta) {
    return rotationMatrix('x', theta);
}
/**
 * Constructs a rotation matrix that will rotate things around the Y-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export function rotateY(theta) {
    return rotationMatrix('y', theta);
}
/**
 * Constructs a rotation matrix that will rotate things around the Z-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export function rotateZ(theta) {
    return rotationMatrix('z', theta);
}
/**
 * Constructs a scale matrix.
 *
 * @deprecated This function has been replaced with {@linkcode scaleMatrix}, which accepts more
 * versatile inputs.
 */
export function scale(x, y, z) {
    return scaleMatrix(x, y, z);
}
/**
 * @deprecated This function has been renamed to {@linkcode lookAtMatrix} for consistency with the
 * other transformation matrix functions.
 */
export function lookAt(eye, at, up) {
    return lookAtMatrix(eye, at, up ?? null);
}
/**
 * @deprecated This function has been renamed to {@linkcode orthographicMatrix} for consistency with
 * the other transformation matrix functions.
 */
export function ortho(left, right, bottom, top, near, far) {
    return orthographicMatrix(left, right, bottom, top, near, far);
}
/**
 * @deprecated This function has been renamed to {@linkcode perspectiveMatrix} for consistency with
 * the other transformation matrix functions.
 */
export function perspective(fovY, aspect, near, far) {
    return perspectiveMatrix(fovY, aspect, near, far);
}
//# sourceMappingURL=transforms.js.map