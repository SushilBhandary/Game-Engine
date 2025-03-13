import { mat4, vec3 } from 'gl-matrix';

export class Transform {
    constructor() {
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.modelMatrix = mat4.create();
    }

    updateModelMatrix() {
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
        return this.modelMatrix;
    }
}