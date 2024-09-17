import type { AnyVector, Vec4, Vec3, Vec2 } from './vec.js';
import type { AnyMatrix, Mat4, Mat3, Mat2 } from './mat.js';
export type VectorWithSizeof<M extends AnyMatrix> = M extends Mat4 ? Vec4 : M extends Mat3 ? Vec3 : M extends Mat2 ? Vec2 : never;
export type MatrixWithSizeof<V extends AnyVector> = V extends Vec4 ? Mat4 : V extends Vec3 ? Mat3 : V extends Vec2 ? Mat2 : never;
/**
 * Checks if two matrices or vectors have all equal components.
 *
 * @throws An error will occur when attempting to compare mismatching types, including comparisons
 * between vectors and matrices of different lengths/sizes.
 */
export declare function equal<T extends AnyVector | AnyMatrix>(u: T, v: T): boolean;
/**
 * 180 over π. Multiplying an angle represented in radians by this number will convert it to
 * degrees.
 */
export declare const RADIANS_TO_DEGREES: number;
/**
 * π over 180. Multiplying an angle represented in degrees by this number will convert it to
 * radians.
 */
export declare const DEGREES_TO_RADIANS: number;
/**
 * Converts an angle from degrees to radians.
 */
export declare function radians(degrees: number): number;
/**
 * Converts a vector of angles from degrees to radians.
 */
export declare function radians<T extends AnyVector>(degAngles: T): T;
/**
 * Converts an angle from radians to degrees.
 */
export declare function degrees(radians: number): number;
/**
 * Converts a vector of angles from radians to degrees.
 */
export declare function degrees<T extends AnyVector>(radAngles: T): T;
/**
 * Computes the sum of two vectors.
 * @param u The left-hand operand.
 * @param v The right-hand operand.
 * @throws An error will occur when attempting to add two non-vector types, or two vector types of
 * different length.
 */
export declare function add<T extends AnyVector>(u: T, v: T): T;
/**
 * Computes the sum of two matrices.
 * @param a The left-hand operand.
 * @param b The right-hand operand.
 * @throws An error will occur when attempting to add two non-matrix types, or two matrix types of
 * different size.
 */
export declare function add<T extends AnyMatrix>(a: T, b: T): T;
/**
 * Computes the difference of two vectors.
 * @param u The left-hand operand.
 * @param v The right-hand operand.
 * @throws An error will occur when attempting to subtract two non-vector types, or two vector types
 * of different length.
 */
export declare function sub<T extends AnyVector>(u: T, v: T): T;
/**
 * Computes the difference of two matrices.
 * @param a The left-hand operand.
 * @param b The right-hand operand.
 * @throws An error will occur when attempting to subtract two non-matrix types, or two matrix types
 * of different size.
 */
export declare function sub<T extends AnyMatrix>(a: T, b: T): T;
/**
 * Computes the difference of two vectors or two matrices.
 * @deprecated This function has been renamed to {@linkcode sub}.
 */
export declare function subtract<T extends AnyVector | AnyMatrix>(u: T, v: T): T;
/**
 * Computes the matrix product of two matrices.
 * @param a The left-hand operand.
 * @param b The right-hand operand.
 * @note Don't forget that matrices are stored in column-major order, which can affect the order
 * that operands need to be written.
 * @throws An error will occur when attempting to multiply two non-matrix or non-vector types (aside
 * from a matrix or vector with a number), or two matrix/vector types of different size.
 */
export declare function mult<T extends AnyMatrix>(a: T, b: T): T;
/**
 * Computes the scalar multiple of a vector or matrix.
 * @param u The matrix or vector.
 * @param scalar A scalar multiplier.
 * @throws An error will occur when attempting to multiply two non-matrix or non-vector types (aside
 * from a matrix or vector with a number), or two matrix/vector types of different size.
 */
export declare function mult<T extends AnyVector | AnyMatrix>(u: T, scalar: number): T;
/**
 * Computes the scalar multiple of a vector or matrix.
 * @param scalar A scalar multiplier.
 * @param u The matrix or vector.
 * @throws An error will occur when attempting to multiply two non-matrix or non-vector types (aside
 * from a matrix or vector with a number), or two matrix/vector types of different size.
 */
export declare function mult<T extends AnyVector | AnyMatrix>(scalar: number, u: T): T;
/**
 * Computes the matrix product between a matrix and vector.
 * @param m The left-hand operand.
 * @param v The right-hand operand. Must be the same size as the matrix provided for {@linkcode m}.
 * @throws An error will occur when attempting to multiply two non-matrix or non-vector types (aside
 * from a matrix or vector with a number), or two matrix/vector types of different size.
 */
export declare function mult<M extends AnyMatrix, V extends VectorWithSizeof<M>>(m: M, v: V): V;
/**
 * Computes the element-wise product of two vectors, also known as the
 * {@link https://en.wikipedia.org/wiki/Hadamard_product_%28matrices%29 _Hadamard product_}.
 *
 * @param u
 * @param v
 *
 * @see {@linkcode dot} For the dot product of two vectors.
 * @see {@linkcode cross} For the cross product of two vectors.
 *
 * @throws An error will occur when attempting to multiply two non-matrix or non-vector types (aside
 * from a matrix or vector with a number), or two matrix/vector types of different size.
 */
export declare function mult<T extends AnyVector>(u: T, v: T): T;
/**
 * Computes the dot product of two vectors.
 */
export declare function dot<T extends AnyVector>(u: T, v: T): number;
/**
 * Computes the cross product of two 3-dimensional vectors.
 */
export declare function cross(u: Vec3, v: Vec3): Vec3;
/**
 * Computes the magnitude of a vector.
 */
export declare function magnitude(v: AnyVector): number;
/**
 * Computes the length (magnitude) of a vector.
 *
 * This function is an alias for {@linkcode magnitude}.
 */
export declare function length(v: AnyVector): number;
/**
 * Computes a normalized version of the given vector.
 */
export declare function normalize<T extends AnyVector>(v: T): T;
/**
 * Negates the given vector (i.e., multiplies it by -1).
 */
export declare function negate<T extends AnyVector>(v: T): T;
/**
 * Mixes two vectors or two numbers together with ratio `s`.
 *
 * `u` is multiplied by `1 - s` before being added to `s * v`.
 * @param u The first vector or number.
 * @param v The second vector or number.
 * @param s A number from 0 to 1; the ratio of `u` to `v`.
 */
export declare function mix<T extends AnyVector | number>(u: T, v: T, s: number): T;
/**
 * Computes the determinant of a matrix.
 */
export declare function det(m: AnyMatrix): number;
/**
 * Computes the inverse of a matrix.
 *
 * @note Since it doesn't really come up that often in computer graphics, this function doesn't
 * bother to check if the matrix is invertible (i.e. if its determinant is zero). It would probably
 * be undesired if such a commonly used function threw an error mid-runtime because of an edge-case
 * like that.
 */
export declare function inverse<T extends AnyMatrix>(m: T): T;
/**
 * Computes the transpose of a matrix.
 */
export declare function transpose<T extends AnyMatrix>(m: T): T;
//# sourceMappingURL=ops.d.ts.map