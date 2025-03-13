export class ScriptSystem {
    constructor() {
        this.scripts = new Map();
    }

    addScript(gameObject, scriptClass, ...args) {
        const script = new scriptClass(...args);
        script.gameObject = gameObject;

        if (!this.scripts.has(gameObject)) {
            this.scripts.set(gameObject, new Set());
        }
        
        this.scripts.get(gameObject).add(script);
        script.init();
        return script;
    }

    removeScript(gameObject, script) {
        const scripts = this.scripts.get(gameObject);
        if (scripts) {
            script.onDestroy();
            scripts.delete(script);
            if (scripts.size === 0) {
                this.scripts.delete(gameObject);
            }
        }
    }

    update(deltaTime) {
        for (const scripts of this.scripts.values()) {
            for (const script of scripts) {
                if (script.enabled) {
                    script.update(deltaTime);
                }
            }
        }
    }

    handleCollision(gameObject1, gameObject2) {
        const scripts1 = this.scripts.get(gameObject1);
        const scripts2 = this.scripts.get(gameObject2);

        if (scripts1) {
            for (const script of scripts1) {
                if (script.enabled) {
                    script.onCollision(gameObject2);
                }
            }
        }

        if (scripts2) {
            for (const script of scripts2) {
                if (script.enabled) {
                    script.onCollision(gameObject1);
                }
            }
        }
    }
}