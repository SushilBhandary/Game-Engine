export class Core {
    static initializeWebGL(canvasElement) {
        const gl = canvasElement.getContext('webgl2');
        if (!gl) {
            throw new Error('WebGL2 not supported');
        }

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        return gl;
    }

    static calculateDeltaTime() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        return deltaTime;
    }

    static gameLoop(engine) {
        const deltaTime = this.calculateDeltaTime();
        
        engine.update(deltaTime);
        engine.render();
        
        requestAnimationFrame(() => this.gameLoop(engine));
    }
}