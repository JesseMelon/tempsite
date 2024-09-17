export * from './vec.js';
export * from './mat.js';
export * from './ops.js';
export * from './transforms.js';
// =================================================================================================
// Helper functions
// =================================================================================================
/**
 * Wraps a `Float32Array` with an index and `push` method.
 *
 * @param size How large of a buffer to create.
 *
 * @deprecated The old MV library itself never uses this for anything. You should prefer using a
 * {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array Float32Array}
 * directly, which already has methods on it for setting ranges of numbers inside the buffers.
 */
export function MVbuffer(size) {
    return {
        buf: new Float32Array(size),
        index: 0,
        push(x) {
            for (let i = 0; i < x.length; i++) {
                this.buf[this.index + i] = x[i];
            }
            this.index += x.length;
            delete this['type'];
        },
    };
}
/**
 * Creates a new Bézier patch of all zeroes.
 *
 * @note The {@linkcode Patch} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export function patch() {
    const out = Object.defineProperties([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ], {
        type: { value: 'patch', writable: false, enumerable: false },
    });
    return out;
}
/**
 * Creates a new Bézier curve of all zeroes.
 *
 * @note The {@linkcode Curve} type is not used by anything in this library. This function is
 * provided for backwards compatibility with the old MV library.
 */
export function curve() {
    const out = Object.defineProperties([0, 0, 0, 0], {
        type: { value: 'curve', writable: false, enumerable: false },
    });
    return out;
}
//# sourceMappingURL=index.js.map