import { vec3 } from 'gl-matrix';

export class CollisionData {
    constructor() {
        this.normal = vec3.create();
        this.penetrationDepth = 0;
        this.contactPoint = vec3.create();
        this.bodyA = null;
        this.bodyB = null;
    }
}