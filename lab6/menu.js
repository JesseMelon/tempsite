function getInput(id) {
    const input = document.getElementById(id);
    if (!(input instanceof HTMLInputElement)) {
        throw new Error(`Element #${id} is not an <input>.`);
    }

    // See if the input has a span next to it, and attach a listener if it does
    const sibling = input.nextElementSibling;
    if (sibling instanceof HTMLSpanElement) {
        input.addEventListener('input', () => {
            sibling.innerText = input.valueAsNumber.toFixed(2)
        });
    }

    return input;
}
const menu = {
    cameraPosition: { x: getInput('cx'), y: getInput('cy'), z: getInput('cz') },
}