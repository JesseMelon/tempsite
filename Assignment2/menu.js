/**
 * @param {string} id
 * @returns {HTMLInputElement}
 */
function getInput(id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLInputElement) return element;
    else throw new Error(`Element #${id} is not an <input>.`);
}
const toggleCameraButton = document.getElementById('toggleCamera');

let altCamera = false
toggleCameraButton.addEventListener('click', () => {
    if(altCamera){
        renderer.setActiveCamera(camera1);
        altCamera = false;
    } else{
        renderer.setActiveCamera(camera2);
        altCamera = true;
    }

});

const menu = {
    tank: {
        position: { x: getInput('tankX'), y: getInput('tankY') },
        scale: getInput('tankScale'),
        rotation: getInput('tankRotation'),
    },
    turret: {
        scale: getInput('turretScale'),
        rotation: getInput('turretRotation'),
    },
    cannon: {
        angle: getInput('canonAngle'),
        scale: getInput('canonScale'),
    },
    crates: {
        position: { x: getInput('cratesX'), y: getInput('cratesY') },
        crate1Z: getInput('crate1Z'),
        crate2X: getInput('crate2X'),
        crate3Y: getInput('crate3Y'),
    }

};

function updateTankPositionX() {
    //tankBody.transform.translate([menu.tank.position.x.valueAsNumber, 0, 0]);
    tankBody.transform.setTransform(
        [menu.tank.position.x.valueAsNumber, 0, menu.tank.position.y.valueAsNumber], 
        [0, menu.tank.rotation.valueAsNumber / 28.69, 0], 
        [menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber ]
    );
}

function updateTankPositionY() {
    tankBody.transform.setTransform(
        [menu.tank.position.x.valueAsNumber, 0, menu.tank.position.y.valueAsNumber], 
        [0, menu.tank.rotation.valueAsNumber / 28.69, 0], 
        [menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber ]
    );
}

// Other update functions for scale, rotation, etc.
function updateTankScale() {
    tankBody.transform.setScale([menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber,menu.tank.scale.valueAsNumber])
}

function updateTankRotation() {
    tankBody.transform.setRotationAlongAxis(menu.tank.rotation.valueAsNumber / 28.69, 1);
    // Code to update tank rotation
}

function updateTurretRotation() {
    tankTurret.transform.setRotationAlongAxis(menu.turret.rotation.valueAsNumber / 28.69, 1);
    // Add code to update turret rotation
}

function updateTurretScale() {
    tankTurret.transform.setScale([menu.turret.scale.valueAsNumber,menu.turret.scale.valueAsNumber,menu.turret.scale.valueAsNumber])
    // Add code to update turret scale
}

function updateCannonAngle() {
    barrelGroup.setRotationAlongAxis(menu.cannon.angle.valueAsNumber / 40, 2);
    // Add code to update canon angle
}

function updateCannonScale() {
    barrelGroup.setScale([menu.cannon.scale.valueAsNumber,menu.cannon.scale.valueAsNumber,menu.cannon.scale.valueAsNumber]);
    // Add code to update canon scale
}

function updateCratesPositionX() {
    crateGroup.setTransform(
        [menu.crates.position.x.valueAsNumber, 0, menu.crates.position.y.valueAsNumber], 
        [0,0, 0], 
        [1,1,1]
    );
}

function updateCratesPositionY() {
    crateGroup.setTransform(
        [menu.crates.position.x.valueAsNumber, 0, menu.crates.position.y.valueAsNumber], 
        [0,0, 0], 
        [1,1,1]
    );
}
// Individual crate updates
function updateCratesCrate1Z() {
    crate1.transform.setTransform(
        [-4, menu.crates.crate1Z.valueAsNumber + 1, 0.6], 
        [0,0,0], 
        [1,1,1]
    );
}

function updateCratesCrate2X() {
    crate2.transform.setTransform(
        [menu.crates.crate2X.valueAsNumber - 4, 0, 0], 
        [0,0,0], 
        [1,1,1]
    );
}

function updateCratesCrate3Y() {
    crate3.transform.setTransform(
        [-4.2, 0, menu.crates.crate3Y.valueAsNumber + 1.1], 
        [0,0,0], 
        [1,1,1]
    );
}

function attachListeners(obj, path = []) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            const currentPath = path.concat(key);

            if (element instanceof HTMLInputElement) {
                
                // Determine specific function based on the axis or control type
                const callbackName = `update${currentPath.map(capitalize).join('')}`;

                const callback = window[callbackName];

                if (typeof callback === 'function') {
                    element.addEventListener('input', callback);
                }
            } else if (typeof element === 'object' && element !== null) {
                attachListeners(element, currentPath);
            }
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

attachListeners(menu);