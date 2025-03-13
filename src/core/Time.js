export class Time {
    constructor() {
        this.lastTime = 0;
        this.deltaTime = 0;
    }

    update(currentTime) {
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
    }

    getDeltaTime() {
        return this.deltaTime;
    }
}