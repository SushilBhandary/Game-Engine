export class GameLoop {
    constructor(engine) {
        this.engine = engine;
        this.isRunning = false;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop(0);
        }
    }

    stop() {
        this.isRunning = false;
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        this.engine.time.update(currentTime);
        this.engine.update();
        this.engine.render();

        requestAnimationFrame((time) => this.loop(time));
    }
}