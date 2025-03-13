import { CollisionResolver } from './CollisionResolver.js';
import { CollisionData } from './CollisionData.js';
import { Octree } from './Octree.js';
import { AABB } from '../scene/AABB.js';

/**
 * Manages physics simulation and collision detection in the game engine.
 * @class
 */
export class PhysicsSystem {
    /**
     * Creates a new PhysicsSystem instance.
     * @param {Engine} engine - The main engine instance.
     */
    constructor(engine) {
        /** @private */
        this.engine = engine;
        
        /**
         * Defines the boundaries of the physics world.
         * @type {AABB}
         */
        this.worldBounds = new AABB(
            [-1000, -1000, -1000],
            [1000, 1000, 1000]
        );

        /**
         * Spatial partitioning structure for efficient collision detection.
         * @type {Octree}
         */
        this.octree = new Octree(this.worldBounds);

        /**
         * Time accumulator for fixed timestep physics.
         * @type {number}
         * @private
         */
        this.accumulator = 0;

        /**
         * Fixed timestep duration in seconds.
         * @type {number}
         */
        this.fixedTimeStep = 1/60;
    }

    /**
     * Updates the physics simulation.
     * @param {number} deltaTime - Time elapsed since last update in seconds.
     */
    update(deltaTime) {
        try {
            this.engine.logger.debug('Physics update started', 'Physics');
            this.updateSpatialPartitioning();
            
            this.accumulator += deltaTime;
            while (this.accumulator >= this.fixedTimeStep) {
                this.fixedUpdate(this.fixedTimeStep);
                this.accumulator -= this.fixedTimeStep;
            }
            
            this.engine.logger.debug('Physics update completed', 'Physics');
        } catch (error) {
            this.engine.logger.error(`Physics update failed: ${error.message}`, 'Physics');
        }
    }

    /**
     * Updates the spatial partitioning structure with current object positions.
     * @private
     */
    updateSpatialPartitioning() {
        this.octree.clear();
        
        for (const object of this.engine.scene.getPhysicsObjects()) {
            this.octree.insert({
                bounds: object.getWorldBounds(),
                object: object
            });
        }
    }

    /**
     * Performs physics calculations at a fixed time step.
     * @param {number} deltaTime - Fixed time step duration in seconds.
     * @private
     */
    fixedUpdate(deltaTime) {
        for (const object of this.engine.scene.getPhysicsObjects()) {
            const nearbyObjects = this.octree.query(object.getWorldBounds());
            
            for (const nearby of nearbyObjects) {
                if (nearby.object !== object) {
                    this.checkCollision(object, nearby.object);
                }
            }
            
            object.updatePhysics(deltaTime);
        }
    }

    /**
     * Checks for collision between two physics objects.
     * @param {GameObject} object1 - First physics object.
     * @param {GameObject} object2 - Second physics object.
     * @returns {boolean} True if collision occurred, false otherwise.
     * @private
     */
    checkCollision(object1, object2) {
        const collider1 = object1.getComponent('collider');
        const collider2 = object2.getComponent('collider');

        if (!collider1 || !collider2) return false;

        const collision = CollisionResolver.detectCollision(collider1, collider2);
        
        if (collision) {
            this.resolveCollision(object1, object2, collision);
            return true;
        }

        return false;
    }

    /**
     * Resolves a collision between two objects.
     * @param {GameObject} object1 - First physics object.
     * @param {GameObject} object2 - Second physics object.
     * @param {CollisionData} collisionData - Data about the collision.
     * @private
     */
    resolveCollision(object1, object2, collisionData) {
        const rb1 = object1.getComponent('rigidBody');
        const rb2 = object2.getComponent('rigidBody');

        if (rb1) rb1.handleCollision(object2, collisionData);
        if (rb2) rb2.handleCollision(object1, collisionData);

        // Trigger collision events
        if (object1.onCollision) object1.onCollision(object2);
        if (object2.onCollision) object2.onCollision(object1);
    }
}