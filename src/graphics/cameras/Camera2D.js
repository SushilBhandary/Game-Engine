import { mat4, vec2 } from 'gl-matrix';
import { Camera } from './Camera.js';

export class Camera2D extends Camera {
    constructor() {
        super();
        this.position = vec2.fromValues(0, 0);
        this.zoom = 1.0;
        this.width = 800;
        this.height = 600;
        
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    updateViewMatrix() {
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [-this.position[0], -this.position[1], 0]);
        mat4.scale(this.viewMatrix, this.viewMatrix, [this.zoom, this.zoom, 1]);
        return this.viewMatrix;
    }

    updateProjectionMatrix() {
        mat4.ortho(
            this.projectionMatrix,
            0,
            this.width,
            this.height,
            0,
            -1,
            1
        );
        return this.projectionMatrix;
    }

    setPosition(x, y) {
        vec2.set(this.position, x, y);
        this.updateViewMatrix();
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this.updateViewMatrix();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.updateProjectionMatrix();
    }
}