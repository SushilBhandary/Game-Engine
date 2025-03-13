import { mat4, vec3 } from 'gl-matrix';

export class Camera {
    constructor() {
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    }

    getViewMatrix() {
        return this.viewMatrix;
    }

    getProjectionMatrix() {
        return this.projectionMatrix;
    }
}