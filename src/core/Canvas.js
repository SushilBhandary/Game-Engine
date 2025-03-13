export class Canvas {
    constructor() {
        this.element = document.getElementById('gameCanvas');
        this.initializeCanvas();
    }

    initializeCanvas() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.element.width = window.innerWidth;
        this.element.height = window.innerHeight;
    }

    get width() {
        return this.element.width;
    }

    get height() {
        return this.element.height;
    }
}