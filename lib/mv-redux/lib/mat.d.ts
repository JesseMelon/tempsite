import type { Vec2, Vec3, Vec4 } from './vec.js';
export type Mat2 = [[number, number], [number, number]] & {
    type: 'mat2';
};
export type Mat3 = [[number, number, number], [number, number, number], [number, number, number]] & {
    type: 'mat3';
};
export type Mat4 = [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]] & {
    type: 'mat4';
};
export type AnyMatrix = Mat2 | Mat3 | Mat4;
/**
 * Determines whether or not the given object is a matrix.
 */
export declare function isMatrix(v: unknown): v is AnyMatrix;
/**
 * Creates a 2×2 matrix.
 *
 * @note Arguments are given in **column-major order.**
 *
 * @param m00 The value for row 1, column 1.
 * @param m10 The value for row 2, column 1.
 * @param m01 The value for row 1, column 2.
 * @param m11 The value for row 2, column 2.
 */
export declare function mat2(m00: number, m10: number, m01: number, m11: number): Mat2;
/**
 * Creates a 2×2 identity matrix (all zeroes, with ones on the diagonal).
 */
export declare function mat2(): Mat2;
/**
 * Creates a 2×2 matrix with the same value down its entire diagonal.
 */
export declare function mat2(diagonal: number): Mat2;
/**
 * Creates a 2×2 matrix by copying another matrix.
 *
 * If the source matrix is larger than 2×2, then only the top-left corner will be copied,
 * effectively truncating it.
 */
export declare function mat2(mat: AnyMatrix): Mat2;
/**
 * Creates a 2×2 matrix out of two column vectors.
 */
export declare function mat2(c0: Vec2, c1: Vec2): Mat2;
/**
 * Creates a 3×3 matrix.
 *
 * @note Arguments are given in **column-major order.**
 *
 * @param m00 The value for row 1, column 1.
 * @param m10 The value for row 2, column 1.
 * @param m20 The value for row 3, column 1.
 * @param m01 The value for row 1, column 2.
 * @param m11 The value for row 2, column 2.
 * @param m21 The value for row 3, column 2.
 * @param m02 The value for row 1, column 3.
 * @param m12 The value for row 2, column 3.
 * @param m22 The value for row 3, column 3.
 */
export declare function mat3(m00: number, m10: number, m20: number, m01: number, m11: number, m21: number, m02: number, m12: number, m22: number): Mat3;
/**
 * Creates a 3×3 identity matrix (all zeroes, with ones on the diagonal).
 */
export declare function mat3(): Mat3;
/**
 * Creates a 3×3 matrix with the same value down its entire diagonal.
 */
export declare function mat3(diagonal: number): Mat3;
/**
 * Creates a 3×3 matrix by copying another matrix.
 *
 * If the source matrix is smaller than 3×3, its entries will fill the top-left corner of the
 * resulting matrix. If it is _larger_ than 3×3, then only the top-left corner will be copied,
 * effectively truncating the source matrix.
 */
export declare function mat3(mat: AnyMatrix): Mat3;
/**
 * Creates a 3×3 matrix out of three column vectors.
 */
export declare function mat3(c0: Vec3, c1: Vec3, c2: Vec3): Mat3;
/**
 * Creates a 4×4 matrix.
 *
 * @note Arguments are given in **column-major order.**
 *
 * @param m00 The value for row 1, column 1.
 * @param m10 The value for row 2, column 1.
 * @param m20 The value for row 3, column 1.
 * @param m30 The value for row 4, column 1.
 * @param m01 The value for row 1, column 2.
 * @param m11 The value for row 2, column 2.
 * @param m21 The value for row 3, column 2.
 * @param m31 The value for row 4, column 2.
 * @param m02 The value for row 1, column 3.
 * @param m12 The value for row 2, column 3.
 * @param m22 The value for row 3, column 3.
 * @param m32 The value for row 4, column 3.
 * @param m03 The value for row 1, column 4.
 * @param m13 The value for row 2, column 4.
 * @param m23 The value for row 3, column 4.
 * @param m33 The value for row 4, column 4.
 */
export declare function mat4(m00: number, m10: number, m20: number, m30: number, m01: number, m11: number, m21: number, m31: number, m02: number, m12: number, m22: number, m32: number, m03: number, m13: number, m23: number, m33: number): Mat4;
/**
 * Creates a 4×4 identity matrix (all zeroes, with ones on the diagonal).
 */
export declare function mat4(): Mat4;
/**
 * Creates a 4×4 matrix with the same value down its entire diagonal.
 */
export declare function mat4(diagonal: number): Mat4;
/**
 * Creates a 4×4 matrix by copying another matrix.
 *
 * If the source matrix is smaller than 4×4, its entries will fill the top-left corner of the
 * resulting matrix.
 */
export declare function mat4(mat: AnyMatrix): Mat4;
/**
 * Creates a 4×4 matrix out of four column vectors.
 */
export declare function mat4(c0: Vec4, c1: Vec4, c2: Vec4, c3: Vec4): Mat4;
//# sourceMappingURL=mat.d.ts.map