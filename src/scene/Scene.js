import { vec3 } from 'gl-matrix';

export class Scene {
    constructor() {
        this.gameObjects = new Map();
        this.hierarchy = new Map();
        this.colliders = new Map();
    }

    addCollider(gameObject, collider) {
        this.colliders.set(gameObject.name, collider);
    }

    checkCollision(objA, objB) {
        const colliderA = this.colliders.get(objA.name);
        const colliderB = this.colliders.get(objB.name);

        if (!colliderA || !colliderB) return false;

        if (colliderA instanceof AABB && colliderB instanceof AABB) {
            return this.checkAABBCollision(objA, colliderA, objB, colliderB);
        } else if (colliderA instanceof BoundingSphere && colliderB instanceof BoundingSphere) {
            return this.checkSphereCollision(objA, colliderA, objB, colliderB);
        }

        return false;
    }

    checkAABBCollision(objA, aabbA, objB, aabbB) {
        // Transform AABB by object's world position
        const minA = vec3.add(vec3.create(), aabbA.min, objA.transform.position);
        const maxA = vec3.add(vec3.create(), aabbA.max, objA.transform.position);
        const minB = vec3.add(vec3.create(), aabbB.min, objB.transform.position);
        const maxB = vec3.add(vec3.create(), aabbB.max, objB.transform.position);

        return (minA[0] <= maxB[0] && maxA[0] >= minB[0]) &&
               (minA[1] <= maxB[1] && maxA[1] >= minB[1]) &&
               (minA[2] <= maxB[2] && maxA[2] >= minB[2]);
    }

    checkSphereCollision(objA, sphereA, objB, sphereB) {
        // Transform sphere centers by object's world position
        const centerA = vec3.add(vec3.create(), sphereA.center, objA.transform.position);
        const centerB = vec3.add(vec3.create(), sphereB.center, objB.transform.position);

        const radiusSum = sphereA.radius + sphereB.radius;
        const distanceSq = vec3.squaredDistance(centerA, centerB);

        return distanceSq <= radiusSum * radiusSum;
    }

    update(deltaTime) {
        // Update all game objects
        for (const gameObject of this.gameObjects.values()) {
            gameObject.update(deltaTime);
        }

        // Check collisions between all objects with colliders
        const objects = Array.from(this.colliders.keys());
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const objA = this.gameObjects.get(objects[i]);
                const objB = this.gameObjects.get(objects[j]);

                if (this.checkCollision(objA, objB)) {
                    // Trigger collision events
                    if (objA.onCollision) objA.onCollision(objB);
                    if (objB.onCollision) objB.onCollision(objA);
                }
            }
        }
    }

    addGameObject(gameObject, parentName = null) {
        this.gameObjects.set(gameObject.name, gameObject);
        this.hierarchy.set(gameObject.name, parentName);
        
        if (parentName) {
            const parent = this.gameObjects.get(parentName);
            if (parent) {
                gameObject.transform.parent = parent.transform;
            }
        }
    }

    render(renderer, shader) {
        // Helper function to get all children of a node
        const getChildren = (parentName) => {
            return Array.from(this.hierarchy.entries())
                .filter(([_, parent]) => parent === parentName)
                .map(([name]) => name);
        };

        // Recursive render function
        const renderNode = (nodeName) => {
            const gameObject = this.gameObjects.get(nodeName);
            if (gameObject) {
                renderer.render(gameObject, shader);
            }

            // Render all children
            for (const childName of getChildren(nodeName)) {
                renderNode(childName);
            }
        };

        // Start rendering from root nodes (nodes with no parent)
        for (const [name, parent] of this.hierarchy.entries()) {
            if (!parent) {
                renderNode(name);
            }
        }
    }
}