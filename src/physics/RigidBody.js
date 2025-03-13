import { vec3 } from 'gl-matrix';

export class RigidBody {
    constructor() {
        this.mass = 1;
        this.velocity = vec3.create();
        this.acceleration = vec3.create();
        this.forces = vec3.create();
        this.gravity = vec3.fromValues(0, -9.81, 0);
        this.useGravity = true;
        this.isKinematic = false;
        this.drag = 0.1;
    }

    applyForce(force) {
        vec3.add(this.forces, this.forces, force);
    }

    applyImpulse(impulse) {
        const scaledImpulse = vec3.scale(vec3.create(), impulse, 1 / this.mass);
        vec3.add(this.velocity, this.velocity, scaledImpulse);
    }

    update(deltaTime) {
        if (this.isKinematic) return;

        // Apply gravity
        if (this.useGravity) {
            vec3.add(this.forces, this.forces, 
                vec3.scale(vec3.create(), this.gravity, this.mass));
        }

        // Calculate acceleration (F = ma)
        vec3.scale(this.acceleration, this.forces, 1 / this.mass);

        // Update velocity
        vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, deltaTime);

        // Apply drag
        vec3.scale(this.velocity, this.velocity, 1 - this.drag * deltaTime);

        // Update position
        if (this.gameObject) {
            vec3.scaleAndAdd(
                this.gameObject.transform.position,
                this.gameObject.transform.position,
                this.velocity,
                deltaTime
            );
        }

        // Reset forces
        vec3.zero(this.forces);
    }
}