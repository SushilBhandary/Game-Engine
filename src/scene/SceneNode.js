import { Transform } from '../core/Transform.js';
import { mat4 } from 'gl-matrix';

export class SceneNode {
    constructor(name) {
        this.name = name;
        this.transform = new Transform();
        this.children = new Map();
        this.parent = null;
        this.mesh = null;
        this.shader = null;
    }

    addChild(node) {
        node.parent = this;
        this.children.set(node.name, node);
        return node;
    }

    removeChild(name) {
        const node = this.children.get(name);
        if (node) {
            node.parent = null;
            this.children.delete(name);
        }
    }

    getWorldMatrix() {
        const worldMatrix = this.transform.updateModelMatrix();
        
        if (this.parent) {
            const parentWorldMatrix = this.parent.getWorldMatrix();
            mat4.multiply(worldMatrix, parentWorldMatrix, worldMatrix);
        }
        
        return worldMatrix;
    }

    update(deltaTime) {
        // Update this node
        if (this.onUpdate) {
            this.onUpdate(deltaTime);
        }

        // Update children
        for (const child of this.children.values()) {
            child.update(deltaTime);
        }
    }
}