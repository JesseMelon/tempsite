/**
 * Debounces a function, returning a new version of it that will only execute after {@linkcode wait}
 * milliseconds have been passed since its last invocation.
 *
 * @param func The function to debounce.
 *
 * @param wait How long of a delay there should be before calling the function.
 *
 * @returns A new version of {@linkcode func} that avoids repeated invocations by waiting for at a
 * pause of {@linkcode wait} milliseconds before executing.
 */
export function debounce(func, wait) {
    let timer = undefined;
    return function (...args) {
        clearTimeout(timer); // Reset the timer
        timer = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttles a function, returning a new one that will execute at most once every {@linkcode wait}
 * milliseconds.
 *
 * @param func The function to throttle.
 *
 * @param wait How long to wait between successive function calls.
 *
 * @returns A new version of {@linkcode func} that avoids repeated invocations by only executing
 * once every {@linkcode wait} milliseconds.
 *
 * If the throttled function is called during the timeout, it will be executed for a final time once
 * the timer expires. For example, throttling a function for 500ms and calling it once at times 0ms
 * and 250ms will cause it to execute once at 0ms and once at 500ms.
 */
export function throttle(func, wait) {
    let pending = false;
    let trailing = false;
    return function (...args) {
        if (!pending) {
            func(...args);
            pending = true;
            setTimeout(() => {
                pending = false;
                // If a second call happened, execute it one more time before stopping.
                if (trailing) {
                    trailing = false;
                    func(...args);
                }
            }, wait);
        }
        else {
            // This function was called while waiting; mark it as needing a trailing call.
            trailing = true;
        }
    };
}
//# sourceMappingURL=index.js.map