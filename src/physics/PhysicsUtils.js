export class PhysicsUtils {
    static checkCollision(object1, object2) {
        const bounds1 = object1.getBoundingBox();
        const bounds2 = object2.getBoundingBox();

        return bounds1.intersects(bounds2);
    }

    static applyForce(object, force, deltaTime) {
        if (!object.rigidBody) return;

        const acceleration = force.scale(1 / object.rigidBody.mass);
        object.rigidBody.velocity.add(acceleration.scale(deltaTime));
    }

    static resolveCollision(object1, object2, collisionData) {
        if (!object1.rigidBody || !object2.rigidBody) return;

        const restitution = Math.min(object1.rigidBody.restitution, object2.rigidBody.restitution);
        const relativeVelocity = object1.rigidBody.velocity.subtract(object2.rigidBody.velocity);
        const impulse = relativeVelocity.scale(-(1 + restitution));

        this.applyImpulse(object1, object2, impulse, collisionData.normal);
    }
}