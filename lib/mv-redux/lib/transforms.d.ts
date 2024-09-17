import type { Mat3, Mat4 } from './mat.js';
import type { Vec3 } from './vec.js';
/**
 * Constructs a transformation matrix that will shift points along the three axes by the offsets
 * given as the components of a vector.
 */
export declare function translationMatrix(translation: Vec3): Mat4;
/**
 * Constructs a transformation matrix that will shift points along the three axes by the given
 * offsets.
 */
export declare function translationMatrix(x: number, y: number, z: number): Mat4;
/**
 * Constructs a transformation matrix that will rotate points around the given axis by some angle.
 * @param axis Which axis to rotate around.
 * @param angle How far (**in degrees**) to rotate around the axis.
 */
export declare function rotationMatrix(axis: 'x' | 'y' | 'z', angle: number): Mat4;
/**
 * Constructs a transformation matrix that will rotate points around an arbitrary axis.
 * @param axis A unit-vector that describes the direction of the axis to rotate around.
 * @param angle How far (**in degrees**) to rotate around the axis.
 */
export declare function rotationMatrix(axis: Vec3, angle: number): Mat4;
/**
 * Constructs a scale matrix that will resize an object by the same amount in all three dimensions.
 */
export declare function scaleMatrix(uniformScale: number): Mat4;
/**
 * Constructs a scale matrix that will resize an object along the X, Y, and Z axes.
 * @param xyzScales A vector describing how much object should squash or stretch on the X, Y, and Z
 * axes respectively.
 */
export declare function scaleMatrix(xyzScales: Vec3): Mat4;
/**
 * Constructs a scale matrix that will resize an object along the X, Y, and Z axes respectively.
 */
export declare function scaleMatrix(x: number, y: number, z: number): Mat4;
/**
 * Constructs a _look-at matrix;_ a model–view matrix that will reposition points in 3D space such
 * that the visible points mimic the viewport of a virtual camera.
 * @param eyePosition The position of the virtual camera.
 * @param target Where in space the virtual camera should point.
 * @param upVec A unit-vector which describes a direction. The virtual camera is oriented such that
 * "up" on the screen, from its perspective, aligns with this direction. Defaults to `(0, 1, 0)`;
 * upwards along the Y-axis.
 */
export declare function lookAtMatrix(eyePosition: Vec3, target: Vec3, upVec?: Vec3): Mat4;
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
export declare function perspectiveMatrix(fovY: number, aspectRatio: number, near: number, far: number): Mat4;
/**
 * Constructs an _orthographic projection matrix_.
 *
 * @see {@link https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix.html}.
 */
export declare function orthographicMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
/**
 * Constructs a normal matrix from a regular transformation matrix.
 * @param m The transformation matrix to create a normal matrix from.
 * @param asMat3 Whether or not the result should be trimmed down from a `Mat4` to a `Mat3`.
 * Defaults to `false`.
 */
export declare function normalMatrix(m: Mat4, asMat3?: false): Mat4;
/**
 * Constructs a normal matrix from a regular transformation matrix.
 * @param m The transformation matrix to create a normal matrix from.
 * @param asMat3 Whether or not the result should be trimmed down from a `Mat4` to a `Mat3`.
 * Defaults to `false`.
 */
export declare function normalMatrix(m: Mat4, asMat3: true): Mat3;
/**
 * Constructs a normal matrix from a regular transformation matrix.
 * @param m The transformation matrix to create a normal matrix from.
 */
export declare function normalMatrix(m: Mat3): Mat3;
/**
 * Creates a translation matrix.
 *
 * @deprecated This function has been replaced with {@linkcode translationMatrix}, which accepts
 * more versatile inputs.
 */
export declare function translate(x: number, y: number, z: number): Mat4;
/**
 * Creates an axis-angle rotation matrix.
 *
 * @deprecated This function, as well as {@linkcode rotateX}, {@linkcode rotateY}, and
 * {@linkcode rotateZ}, have all been replaced by {@linkcode rotationMatrix}, which handles all
 * rotation matrices.
 */
export declare function rotate(angle: number, axis: [number, number, number]): Mat4;
/**
 * Creates an axis-angle rotation matrix.
 *
 * @deprecated This function, as well as {@linkcode rotateX}, {@linkcode rotateY}, and
 * {@linkcode rotateZ}, have all been replaced by {@linkcode rotationMatrix}, which handles all
 * rotation matrices.
 */
export declare function rotate(angle: number, axisX: number, axisY: number, axisZ: number): Mat4;
/**
 * Constructs a rotation matrix that will rotate things around the X-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export declare function rotateX(theta: number): Mat4;
/**
 * Constructs a rotation matrix that will rotate things around the Y-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export declare function rotateY(theta: number): Mat4;
/**
 * Constructs a rotation matrix that will rotate things around the Z-axis.
 *
 * @deprecated This function has been replaced with {@linkcode rotationMatrix}, which accepts more
 * versatile inputs.
 */
export declare function rotateZ(theta: number): Mat4;
/**
 * Constructs a scale matrix.
 *
 * @deprecated This function has been replaced with {@linkcode scaleMatrix}, which accepts more
 * versatile inputs.
 */
export declare function scale(x: number, y: number, z: number): Mat4;
/**
 * @deprecated This function has been renamed to {@linkcode lookAtMatrix} for consistency with the
 * other transformation matrix functions.
 */
export declare function lookAt(eye: Vec3, at: Vec3, up: Vec3): Mat4;
/**
 * @deprecated This function has been renamed to {@linkcode orthographicMatrix} for consistency with
 * the other transformation matrix functions.
 */
export declare function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
/**
 * @deprecated This function has been renamed to {@linkcode perspectiveMatrix} for consistency with
 * the other transformation matrix functions.
 */
export declare function perspective(fovY: number, aspect: number, near: number, far: number): Mat4;
//# sourceMappingURL=transforms.d.ts.map