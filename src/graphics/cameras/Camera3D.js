import { mat4, vec3 } from 'gl-matrix';
import { Camera } from './Camera.js';

export class Camera3D extends Camera {
    constructor() {
        super();
        this.position = vec3.fromValues(0, 0, 5);
        this.target = vec3.fromValues(0, 0, 0);
        this.up = vec3.fromValues(0, 1, 0);
        this.fov = 45 * Math.PI / 180;
        this.aspect = 1;
        this.near = 0.1;
        this.far = 100.0;
        
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    updateViewMatrix() {
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
        return this.viewMatrix;
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
        return this.projectionMatrix;
    }

    setPosition(x, y, z) {
        vec3.set(this.position, x, y, z);
        this.updateViewMatrix();
    }

    setTarget(x, y, z) {
        vec3.set(this.target, x, y, z);
        this.updateViewMatrix();
    }

    setAspect(aspect) {
        this.aspect = aspect;
        this.updateProjectionMatrix();
    }

    setFov(fov) {
        this.fov = fov * Math.PI / 180;
        this.updateProjectionMatrix();
    }
}