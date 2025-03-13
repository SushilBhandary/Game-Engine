import { vec3 } from 'gl-matrix';

export class CollisionResolver {
    resolve(collision) {
        this.resolvePosition(collision);
        this.resolveVelocity(collision);
    }

    resolvePosition(collision) {
        const { bodyA, bodyB, normal, penetrationDepth } = collision;
        
        if (!bodyA.isKinematic) {
            const moveA = vec3.scale(vec3.create(), normal, penetrationDepth * 0.5);
            vec3.add(bodyA.gameObject.transform.position, 
                    bodyA.gameObject.transform.position, moveA);
        }

        if (!bodyB.isKinematic) {
            const moveB = vec3.scale(vec3.create(), normal, -penetrationDepth * 0.5);
            vec3.add(bodyB.gameObject.transform.position, 
                    bodyB.gameObject.transform.position, moveB);
        }
    }

    resolveVelocity(collision) {
        const { bodyA, bodyB, normal } = collision;
        const restitution = Math.min(bodyA.restitution, bodyB.restitution);

        // Calculate relative velocity
        const relativeVel = vec3.subtract(vec3.create(), bodyA.velocity, bodyB.velocity);
        const normalVel = vec3.dot(relativeVel, normal);

        // Don't resolve if objects are separating
        if (normalVel > 0) return;

        // Calculate impulse scalar
        let j = -(1 + restitution) * normalVel;
        j /= (1 / bodyA.mass) + (1 / bodyB.mass);

        // Apply impulse
        const impulse = vec3.scale(vec3.create(), normal, j);

        if (!bodyA.isKinematic) {
            vec3.scaleAndAdd(bodyA.velocity, bodyA.velocity, impulse, 1 / bodyA.mass);
        }

        if (!bodyB.isKinematic) {
            vec3.scaleAndAdd(bodyB.velocity, bodyB.velocity, impulse, -1 / bodyB.mass);
        }

        // Apply friction
        this.resolveFriction(collision, j);
    }

    resolveFriction(collision, normalImpulse) {
        const { bodyA, bodyB, normal } = collision;
        const relativeVel = vec3.subtract(vec3.create(), bodyA.velocity, bodyB.velocity);

        // Calculate tangent vector
        const tangent = vec3.create();
        const normalVelComponent = vec3.scale(vec3.create(), normal, 
            vec3.dot(relativeVel, normal));
        vec3.subtract(tangent, relativeVel, normalVelComponent);

        if (vec3.length(tangent) > 0.0001) {
            vec3.normalize(tangent, tangent);

            // Calculate friction impulse scalar
            const friction = Math.min(bodyA.friction, bodyB.friction);
            let jt = -vec3.dot(relativeVel, tangent);
            jt /= (1 / bodyA.mass) + (1 / bodyB.mass);

            // Clamp friction
            const maxFriction = normalImpulse * friction;
            jt = Math.max(-maxFriction, Math.min(jt, maxFriction));

            // Apply friction impulse
            const frictionImpulse = vec3.scale(vec3.create(), tangent, jt);

            if (!bodyA.isKinematic) {
                vec3.scaleAndAdd(bodyA.velocity, bodyA.velocity, 
                    frictionImpulse, 1 / bodyA.mass);
            }

            if (!bodyB.isKinematic) {
                vec3.scaleAndAdd(bodyB.velocity, bodyB.velocity, 
                    frictionImpulse, -1 / bodyB.mass);
            }
        }
    }
}