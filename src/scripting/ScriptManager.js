export class ScriptManager {
    constructor() {
        this.scripts = new Set();
    }

    addScript(script) {
        this.scripts.add(script);
        if (script.start) {
            script.start();
        }
    }

    removeScript(script) {
        if (script.onDestroy) {
            script.onDestroy();
        }
        this.scripts.delete(script);
    }

    updateScripts(deltaTime) {
        for (const script of this.scripts) {
            if (script.enabled && script.update) {
                script.update(deltaTime);
            }
        }
    }

    clear() {
        for (const script of this.scripts) {
            if (script.onDestroy) {
                script.onDestroy();
            }
        }
        this.scripts.clear();
    }
}