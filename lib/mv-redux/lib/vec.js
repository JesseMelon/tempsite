/**
 * Determines whether or not the given object is a vector.
 */
export function isVector(v) {
    return Array.isArray(v) && (v.type === 'vec4' ||
        v.type === 'vec3' ||
        v.type === 'vec2');
}
export function vec2(...args) {
    const out = [0, 0];
    Object.defineProperty(out, 'type', { value: 'vec2', writable: false, enumerable: false });
    Object.defineProperty(out, 'x', { get() { return this[0]; }, set(n) { this[0] = n; }, enumerable: false });
    Object.defineProperty(out, 'y', { get() { return this[1]; }, set(n) { this[1] = n; }, enumerable: false });
    const values = args.flat(1);
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== 'number')
            throw new Error("Invalid arguments passed to 'vec2'. Expected all numbers.");
    }
    if (args.length == 0) {
        // Leave as zeroes
    }
    else if (args.length == 1 && typeof args[0] === 'number') {
        out[0] = values[0];
        out[1] = values[0];
    }
    else if (values.length >= 2) {
        out[0] = values[0];
        out[1] = values[1];
    }
    else {
        throw new Error("Unreachable: array lengths must fall within range [0, INF).");
    }
    return out;
}
export function vec3(...args) {
    const out = [0, 0, 0];
    Object.defineProperty(out, 'type', { value: 'vec3', writable: false, enumerable: false });
    Object.defineProperty(out, 'x', { get() { return this[0]; }, set(n) { this[0] = n; }, enumerable: false });
    Object.defineProperty(out, 'y', { get() { return this[1]; }, set(n) { this[1] = n; }, enumerable: false });
    Object.defineProperty(out, 'z', { get() { return this[2]; }, set(n) { this[2] = n; }, enumerable: false });
    const values = args.flat(1);
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== 'number')
            throw new Error("Invalid arguments passed to 'vec2'. Expected all numbers.");
    }
    if (args.length == 0) {
        // Leave as zeroes
    }
    else if (args.length == 1 && typeof args[0] === 'number') {
        out[0] = values[0];
        out[1] = values[0];
        out[2] = values[0];
    }
    else if (values.length >= 3) {
        out[0] = values[0];
        out[1] = values[1];
        out[2] = values[2];
    }
    else {
        throw new Error("Invalid arguments passed to 'vec3'. Expected 0 numbers, 1 number, or a sequence of " +
            "arguments with 3 or more total numbers between them.");
    }
    return out;
}
export function vec4(...args) {
    const out = [0, 0, 0, 0];
    Object.defineProperty(out, 'type', { value: 'vec4', writable: false, enumerable: false });
    Object.defineProperty(out, 'x', { get() { return this[0]; }, set(n) { this[0] = n; }, enumerable: false });
    Object.defineProperty(out, 'y', { get() { return this[1]; }, set(n) { this[1] = n; }, enumerable: false });
    Object.defineProperty(out, 'z', { get() { return this[2]; }, set(n) { this[2] = n; }, enumerable: false });
    Object.defineProperty(out, 'w', { get() { return this[3]; }, set(n) { this[3] = n; }, enumerable: false });
    const values = args.flat(1);
    for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== 'number')
            throw new Error("Invalid arguments passed to 'vec2'. Expected all numbers.");
    }
    if (values.length == 0) {
        // Leave as zeroes
    }
    else if (args.length == 1 && typeof args[0] === 'number') {
        out[0] = values[0];
        out[1] = values[0];
        out[2] = values[0];
        out[3] = values[0];
    }
    else if (values.length >= 4) {
        out[0] = values[0];
        out[1] = values[1];
        out[2] = values[2];
        out[3] = values[3];
    }
    else {
        throw new Error("Invalid arguments passed to 'vec4'. Expected 0 numbers, 1 number, or a sequence of " +
            "arguments with 4 or more total numbers between them.");
    }
    return out;
}
//# sourceMappingURL=vec.js.map