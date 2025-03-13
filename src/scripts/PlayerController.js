import { Script } from '../scripting/Script.js';
import { vec3 } from 'gl-matrix';

export class PlayerController extends Script {
    constructor(options = {}) {
        super();
        this.moveSpeed = options.moveSpeed || 5;
        this.jumpForce = options.jumpForce || 10;
        this.moveDirection = vec3.create();
    }

    init() {
        this.rigidBody = this.gameObject.getComponent('rigidBody');
    }

    update(deltaTime) {
        // Handle input
        const input = this.gameObject.engine.input;
        
        // Movement
        if (input.isKeyDown('KeyW')) vec3.add(this.moveDirection, [0, 0, -1]);
        if (input.isKeyDown('KeyS')) vec3.add(this.moveDirection, [0, 0, 1]);
        if (input.isKeyDown('KeyA')) vec3.add(this.moveDirection, [-1, 0, 0]);
        if (input.isKeyDown('KeyD')) vec3.add(this.moveDirection, [1, 0, 0]);

        // Apply movement
        if (this.rigidBody && vec3.length(this.moveDirection) > 0) {
            vec3.normalize(this.moveDirection, this.moveDirection);
            vec3.scale(this.moveDirection, this.moveDirection, this.moveSpeed * deltaTime);
            vec3.add(this.rigidBody.velocity, this.rigidBody.velocity, this.moveDirection);
        }

        // Jump
        if (input.isKeyPressed('Space') && this.rigidBody) {
            vec3.add(this.rigidBody.velocity, this.rigidBody.velocity, [0, this.jumpForce, 0]);
        }

        // Reset move direction
        vec3.zero(this.moveDirection);
    }

    onCollision(other) {
        console.log(`Player collided with ${other.name}`);
    }
}