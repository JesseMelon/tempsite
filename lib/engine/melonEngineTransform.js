MelonEngine.Transform = class {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
        this.localPosition = position;
        this.localRotation = rotation;
        this.localScale = scale;

        this.worldMatrix = mat4.create();
        this.localMatrix = mat4.create();
        
        this.parent = null;
        this.children = [];
    }

    addChild(childTransform) {
        this.children.push(childTransform);
        childTransform.parent = this;
    }

    updateLocalMatrix() {
        mat4.identity(this.localMatrix);
        mat4.translate(this.localMatrix, this.localMatrix, this.localPosition);
        mat4.rotateX(this.localMatrix, this.localMatrix, this.localRotation[0]);
        mat4.rotateY(this.localMatrix, this.localMatrix, this.localRotation[1]);
        mat4.rotateZ(this.localMatrix, this.localMatrix, this.localRotation[2]);
        mat4.scale(this.localMatrix, this.localMatrix, this.localScale);
    }

    updateWorldMatrix() {
        this.updateLocalMatrix();
        if (this.parent) {
            mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.localMatrix);
        } else {
            mat4.copy(this.worldMatrix, this.localMatrix);
        }
        this.children.forEach(child => child.updateWorldMatrix());
    }

    setPosition(x, y, z) {
        this.localPosition = [x, y, z];
    }
}