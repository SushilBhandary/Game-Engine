import { Transform } from '../core/Transform.js';
import { ScriptManager } from '../scripting/ScriptManager.js';

export class GameObject {
    constructor(name, mesh = null, material = null) {
        this.name = name;
        this.mesh = mesh;
        this.material = material;
        this.transform = new Transform();
        this.components = new Map();
        this.scriptManager = new ScriptManager();
    }

    addComponent(name, component) {
        component.gameObject = this;
        this.components.set(name, component);
        return component;
    }

    getComponent(name) {
        return this.components.get(name);
    }

    addScript(script) {
        script.gameObject = this;
        this.scriptManager.addScript(script);
        return script;
    }

    removeScript(script) {
        this.scriptManager.removeScript(script);
    }

    update(deltaTime) {
        this.scriptManager.updateScripts(deltaTime);
        for (const component of this.components.values()) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }

    addRigidBody(options = {}) {
        const rigidBody = new RigidBody();
        Object.assign(rigidBody, options);
        rigidBody.gameObject = this;
        return this.addComponent('rigidBody', rigidBody);
    }
}