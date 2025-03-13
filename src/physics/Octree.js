import { vec3 } from 'gl-matrix';
import { AABB } from '../scene/AABB.js';

export class Octree {
    constructor(bounds, maxObjects = 8, maxDepth = 4) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxDepth = maxDepth;
        this.objects = [];
        this.children = null;
        this.depth = 0;
    }

    subdivide() {
        const halfSize = vec3.scale(vec3.create(), 
            vec3.subtract(vec3.create(), this.bounds.max, this.bounds.min), 
            0.5
        );
        const center = vec3.add(vec3.create(), this.bounds.min, halfSize);

        this.children = [];
        
        // Create eight children octants
        for (let i = 0; i < 8; i++) {
            const min = vec3.create();
            const max = vec3.create();

            min[0] = (i & 1) ? center[0] : this.bounds.min[0];
            min[1] = (i & 2) ? center[1] : this.bounds.min[1];
            min[2] = (i & 4) ? center[2] : this.bounds.min[2];

            max[0] = (i & 1) ? this.bounds.max[0] : center[0];
            max[1] = (i & 2) ? this.bounds.max[1] : center[1];
            max[2] = (i & 4) ? this.bounds.max[2] : center[2];

            const childBounds = new AABB(min, max);
            const child = new Octree(childBounds, this.maxObjects, this.maxDepth);
            child.depth = this.depth + 1;
            this.children.push(child);
        }

        // Redistribute existing objects to children
        for (const obj of this.objects) {
            this.insertToChildren(obj);
        }
        this.objects = [];
    }

    insert(object) {
        if (!this.bounds.intersects(object.bounds)) {
            return false;
        }

        if (this.children === null) {
            if (this.objects.length < this.maxObjects || this.depth >= this.maxDepth) {
                this.objects.push(object);
                return true;
            }
            this.subdivide();
        }

        return this.insertToChildren(object);
    }

    insertToChildren(object) {
        let inserted = false;
        for (const child of this.children) {
            if (child.insert(object)) {
                inserted = true;
            }
        }
        return inserted;
    }

    query(bounds) {
        const result = [];
        
        if (!this.bounds.intersects(bounds)) {
            return result;
        }

        for (const object of this.objects) {
            if (bounds.intersects(object.bounds)) {
                result.push(object);
            }
        }

        if (this.children !== null) {
            for (const child of this.children) {
                result.push(...child.query(bounds));
            }
        }

        return result;
    }

    clear() {
        this.objects = [];
        if (this.children) {
            for (const child of this.children) {
                child.clear();
            }
            this.children = null;
        }
    }
}