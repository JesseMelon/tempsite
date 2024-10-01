//load a text resource from a file over network
var loadTextResource = function(url, callback){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP Status ' + request.status + ' on resource ' + url)
        } else {
            callback(null, request.responseText);
        }
    };
    request.send();
};

function initCanvas(canvas, options) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        window.alert("Failed to initialize canvas. Check the console for details.");
        console.error("Object %o is not a canvas.", canvas);
        throw new Error("`initCanvas` was called on a non-canvas object.");
    }

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        window.alert("Failed to initialize canvas. Check the console for details.");
        throw new Error("Failed to get a `webgl2` context from HTML canvas. WebGL 2 may not be supported by this browser.");
    }

    let baseWidth  // The width of the canvas in CSS pixels, before scaling for DPI.
    let baseHeight // The canvas's height in CSS pixels.
    let dpi        // The ratio to multiply the base width/height by.

    // Figure out how large the canvas is in plain CSS pixels, and set its inline-style to keep it
    // at that size even once we increase its actual resolution.
    if (options?.fullscreen) {
        baseWidth = window.innerWidth;
        baseHeight = window.innerHeight;

        canvas.style.width = '100vw';
        canvas.style.height = '100vh';

        document.body.style.overflow = 'hidden';    // remove scrollbars
        canvas.classList.add('fullscreen');         // so other CSS can do stuff if it wants
    } else {
        // Use the overridden sizes if provided.
        baseWidth = options?.width || canvas.clientWidth || 512;
        baseHeight = options?.height || canvas.clientHeight || 512;

        canvas.style.width = baseWidth + 'px';
        canvas.style.height = baseHeight + 'px';
    }

    if (options?.retina) {
        // Listen for changes to the screen's DPI.
        function onDPIChange() {
            dpi = window.devicePixelRatio || 1;

            // For some reason, TS can't see the `if !canvas` check we did earlier, so it thinks
            // `canvas` might be null inside this function.
            canvas.width = baseWidth * dpi;
            canvas.height = baseHeight * dpi;
            options?.onResize?.(canvas.width, canvas.height);

            // Re-add this function as a listener for the next time the display ratio changes.
            window
                .matchMedia(`(resolution: ${dpi}dppx)`)
                .addEventListener('change', onDPIChange, { once: true })
        }

        onDPIChange();
    } else {
        dpi = 1;
        canvas.width = baseWidth;
        canvas.height = baseHeight;
    }

    if (options?.fullscreen) {
        canvas.classList.add('fullscreen');
        window.addEventListener('resize', throttle(() => {
            // DPI hasn't changed, but the window size has: re-scale the canvas's resolution.
            canvas.width = window.innerWidth * dpi;
            canvas.height = window.innerHeight * dpi;
            options?.onResize?.(canvas.width, canvas.height);
        }, 100));
    }

    return gl;
}