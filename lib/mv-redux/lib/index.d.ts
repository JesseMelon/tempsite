export * from './vec.js';
export * from './mat.js';
export * from './ops.js';
export * from './transforms.js';
/**
 * Wraps a `Float32Array` with an index and `push` method.
 *
 * @param size How large of a buffer to create.
 *
 * @deprecated The old MV library itself never uses this for anything. You should prefer using a
 * {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array Float32Array}
 * directly, which already has methods on it for setting ranges of numbers inside the buffers.
 */
export declare function MVbuffer(size: number): {
    buf: Float32Array;
    index: number;
    push(x: number[]): void;
};
export type Curve = {
    type: 'curve';
} & [number, number, number, number];
export type Patch = {
    type: 'patch';
} & [[number, number, number, number], [number, number, number, number], [number, number, number, number], [number, number, number, number]];
/**
 * Creates a new Bézier patch of all zeroes.
 *
 * @note The {@linkcode Patch} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export declare function patch(): Patch;
/**
 * Creates a new Bézier curve of all zeroes.
 *
 * @note The {@linkcode Curve} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export declare function curve(): Curve;
//# sourceMappingURL=index.d.ts.map