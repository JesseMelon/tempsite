export type Vec2 = [number, number] & {
    type: 'vec2';
    get x(): number;
    set x(n: number);
    get y(): number;
    set y(n: number);
};
export type Vec3 = [number, number, number] & {
    type: 'vec3';
    get x(): number;
    set x(n: number);
    get y(): number;
    set y(n: number);
    get z(): number;
    set z(n: number);
};
export type Vec4 = [number, number, number, number] & {
    type: 'vec4';
    get x(): number;
    set x(n: number);
    get y(): number;
    set y(n: number);
    get z(): number;
    set z(n: number);
    get w(): number;
    set w(n: number);
};
export type AnyVector = Vec2 | Vec3 | Vec4;
/**
 * Determines whether or not the given object is a vector.
 */
export declare function isVector(v: unknown): v is AnyVector;
/**
 * Creates a two-dimensional vector.
 * @param x The `x`-component of the vector.
 * @param y The `y`-component of the vector.
 */
export declare function vec2(x: number, y: number): Vec2;
/**
 * Creates a two-dimensional vector of all zeroes.
 */
export declare function vec2(): Vec2;
/**
 * Creates a two-dimensional vector with the same value for both components.
 * @param value The value to use for both the `x` and `y` components.
 */
export declare function vec2(value: number): Vec2;
/**
 * Creates a two-dimensional vector using values from all of the given arguments.
 *
 * @param values Any combination of number, number array, or vector arguments. Values are copied
 * one-by-one from each until all this vector has both `x`, `y` components.
 *
 * @example
 * const u = vec2(3, 2);
 * const v = vec3(9, 1, 7);
 * const w = [10, 11, 12, 13];
 *
 * const a = vec2(u);   // -> vec2(3, 2)
 * const b = vec2(v);   // -> vec2(9, 1)
 * const c = vec2(w);   // -> vec2(10, 11)
 */
export declare function vec2(...values: (number | number[] | AnyVector)[]): Vec2;
/**
 * Creates a three-dimensional vector.
 * @param x The `x`-component of the vector.
 * @param y The `y`-component of the vector.
 * @param z The `z`-component of the vector.
 */
export declare function vec3(x: number, y: number, z: number): Vec3;
/**
 * Creates a three-dimensional vector of all zeroes.
 */
export declare function vec3(): Vec3;
/**
 * Creates a three-dimensional vector with the same value for all components.
 * @param value The value to use for the `x`, `y`, and `z` components.
 */
export declare function vec3(value: number): Vec3;
/**
 * Creates a three-dimensional vector using values from all of the given arguments.
 *
 * @param values Any combination of number, number array, or vector arguments. Values are copied
 * one-by-one from each until all this vector has all `x`, `y`, and `z` components.
 *
 * @example
 * const u = vec2(1, 2);
 * const v = vec2(8, 9);
 * const w = [-1, 3];
 *
 * const a = vec3(u, v);    // -> vec3(1, 2, 8)
 * const b = vec3(6, u);    // -> vec3(6, 1, 2)
 * const c = vec3(1, w);    // -> vec3(1, -1, 3)
 *
 * @throws An error will occur if fewer than 3 values are given across all arguments.
 */
export declare function vec3(...values: (number | number[] | AnyVector)[]): Vec3;
/**
 * Creates a four-dimensional vector.
 * @param x The `x`-component of the vector.
 * @param y The `y`-component of the vector.
 * @param z The `z`-component of the vector.
 * @param w The `w`-component of the vector.
 */
export declare function vec4(x: number, y: number, z: number, w: number): Vec4;
/**
 * Creates a four-dimensional vector of all zeroes.
 */
export declare function vec4(): Vec4;
/**
 * Creates a four-dimensional vector with the same value for all components.
 * @param value The value to use for `x`, `y`, `z`, and `w` components.
 */
export declare function vec4(value: number): Vec4;
/**
 * Creates a four-dimensional vector using all of the given components and scalars.
 *
 * @param values Any combination of number, number array, or vector arguments. Values are copied
 * one-by-one from each until all this vector has all `x`, `y`, `z`, and `w` components.
 *
 * @example
 * const u = vec2(2, 1);
 * const v = [-1, 3];
 * const w = vec3(8, 7, 9);
 *
 * const a = vec4(u, v);    // -> vec4(2, 1, -1, 3)
 * const c = vec4(w, 1);    // -> vec4(8, 7, 9, 1)
 * const c = vec4(w, u);    // -> vec4(8, 7, 9, 2)
 * const b = vec4(6, v);    // -> Error: too few values passed
 *
 * @throws An error will occur if fewer than 4 values are given across all arguments.
 */
export declare function vec4(...values: (number | number[] | AnyVector)[]): Vec4;
//# sourceMappingURL=vec.d.ts.map