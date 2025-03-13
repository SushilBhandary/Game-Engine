export class Input {
    constructor() {
        this.keys = new Map();
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = new Map();

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleInput(e, true));
        window.addEventListener('keyup', (e) => this.handleInput(e, false));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mousedown', (e) => this.handleMouseButton(e, true));
        window.addEventListener('mouseup', (e) => this.handleMouseButton(e, false));
    }

    handleInput(event, isPressed) {
        this.keys.set(event.code, isPressed);
    }

    handleMouseMove(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    handleMouseButton(event, isPressed) {
        this.mouseButtons.set(event.button, isPressed);
    }
}