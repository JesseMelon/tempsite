MelonEngine.Scene = class {
    constructor(maxObjects = 32) {
        if (maxObjects > 65535) { throw new Error("cannot allocate more than 65,535 transforms, also, whats wrong with you for trying to do that")}

        //array of local transforms
        this.localTransforms = new Float32Array(16 * maxObjects);
        //array of global transforms
        this.globalTransforms = new Float32Array(16 * maxObjects);
        //array of first children
        this.childOfTransform = new Uint16Array(maxObjects).fill(0xFFFF);
        //array of parent
        this.parentOfTransform = new Uint16Array(maxObjects).fill(0xFFFF);
         //array of next sibling 
        this.siblingOfTransform = new Uint16Array(maxObjects).fill(0xFFFF);
        //bitmask of free memory locations in scene tree
        this.freeList = new Uint32Array(Math.ceil(maxObjects / 32));
        //mark bits past final index as unavailable
        this.freeList[Math.floor((maxObjects - 1) / 32)] |= ~((1 << maxObjects % 32) -1) & -maxObjects % 32;

        this.indicesByName = new Map();
        this.numObjects = 0;
        this.maxObjects = maxObjects
    }
    getLocalTransform(index) {
        return this.localTransforms.subarray(index * 16, (index + 1) * 16);
    }
    getGlobalTransform(index) {
        return this.globalTransforms.subarray(index * 16, (index + 1) * 16);
    }
    add({sceneName, sceneParentIndex, sceneParentName}) { 
        const index = this.getFreeIndex(); 
        if (index === -1) {console.error("failed to add object to scene"); return -1;}

        if (sceneName) {
            if (!this.indicesByName.has(sceneName)) {
                this.indicesByName.set(sceneName, index);
            } else {
                console.warn(`Scene name "${sceneName}" already exists.`);
            }
        }
        if (sceneParentIndex){
            this.addChild(sceneParentIndex, index);
        }
        else if (sceneParentName) {
            if (this.indicesByName.has(sceneParentName)){
                this.addChild(this.indicesByName.get(sceneParentName), index);
            } else {
                console.log("no scene object called ", sceneParentName);
            }
        }
        this.freeList[Math.floor(index / 32)] |= (1 << index % 32);
        //this.logFreeList();
        this.numObjects++;
        this.updateGlobals(index);  //since add is creating an empty transform, Im not sure calling update globals here is stricty necessary. Will have to look into
        return new MelonEngine.Transform(this, index);
    }
    addGroup({sceneName, sceneParentName, sceneParentIndex, position = [0,0,0], rotation = [0,0,0], scale = [1,1,1]}){
        const transform = this.add({sceneName, sceneParentName, sceneParentIndex});
        transform.setTransform(position, rotation, scale);
        return transform;
    }
    remove(index){
        console.error("Scene.remove not yet implemented");
    }
    addChild(parentIndex, childIndex){
        //get parents first child
        let childOfTarget = this.childOfTransform[parentIndex]
        //if child is first child, start the child list
        if (childOfTarget === 0xFFFF) {this.childOfTransform[parentIndex] = childIndex; }
        else {
            //parse linked list of siblings until we find the last sibling
            while( this.siblingOfTransform[childOfTarget] != 0xFFFF){ //while the NEXT sibling is empty
                childOfTarget = this.siblingOfTransform[childOfTarget];
            }
            this.siblingOfTransform[childOfTarget] = childIndex; //overwrite the empty with the new sibling
        }
        this.parentOfTransform[childIndex] = parentIndex; //record parent in child data
    }
    removeChild(parentIndex, childIndex){
        console.error("Scene.removeChild not yet implemented");
    }
    getFreeIndex(){
        for (let i = 0; i < this.freeList.length; i++) {
            const chunk = this.freeList[i];
            if (chunk !== 0xFFFFFFFF) {
                return i * 32 + (31 - Math.clz32(~chunk));
            }
        }
        console.warn("scene is full");
        return -1;
    }
    getIndexFromName(name){
        index = this.indicesByName.get(name);
        if (!index){
            console.warn("no object named ", name, " exists");
        }
        return index
    }
    updateGlobals(index){
        if(index === undefined) { console.error("invalid index passed to update children"); return;}
        const localTransform = this.getLocalTransform(index);
        const globalTransform = this.getGlobalTransform(index)

        const parentIndex = this.parentOfTransform[index];
        
        if(parentIndex !== 0xFFFF){ //if transform has a parent convert to global space, else it is already
            const parentGlobalTransform = this.getGlobalTransform(parentIndex);
            mat4.multiply(globalTransform, parentGlobalTransform, localTransform);
        } else {
            mat4.copy(globalTransform, localTransform);
        }

        let childIndex = this.childOfTransform[index];
        while (childIndex !== 0xFFFF) { 
            this.updateGlobals(childIndex);
            childIndex = this.siblingOfTransform[childIndex];
        }
    }
    logFreeList() { //for debugging
        this.freeList.forEach((chunk, index) => {
            const binaryString = chunk.toString(2).padStart(32, '0');
            console.log(`Chunk ${index}: ${binaryString}`);
        });
    }
}