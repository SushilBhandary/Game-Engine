import { vec3 } from 'gl-matrix';

export class AABB {
    constructor(min = vec3.create(), max = vec3.create()) {
        this.min = min;
        this.max = max;
    }

    static fromPoints(points) {
        const min = vec3.fromValues(Infinity, Infinity, Infinity);
        const max = vec3.fromValues(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < points.length; i += 3) {
            min[0] = Math.min(min[0], points[i]);
            min[1] = Math.min(min[1], points[i + 1]);
            min[2] = Math.min(min[2], points[i + 2]);
            max[0] = Math.max(max[0], points[i]);
            max[1] = Math.max(max[1], points[i + 1]);
            max[2] = Math.max(max[2], points[i + 2]);
        }

        return new AABB(min, max);
    }
}

export class BoundingSphere {
    constructor(center = vec3.create(), radius = 0) {
        this.center = center;
        this.radius = radius;
    }

    static fromPoints(points) {
        const center = vec3.create();
        let maxRadiusSq = 0;

        // Calculate center
        for (let i = 0; i < points.length; i += 3) {
            vec3.add(center, center, vec3.fromValues(points[i], points[i + 1], points[i + 2]));
        }
        vec3.scale(center, center, 1 / (points.length / 3));

        // Calculate radius
        for (let i = 0; i < points.length; i += 3) {
            const point = vec3.fromValues(points[i], points[i + 1], points[i + 2]);
            const radiusSq = vec3.squaredDistance(center, point);
            maxRadiusSq = Math.max(maxRadiusSq, radiusSq);
        }

        return new BoundingSphere(center, Math.sqrt(maxRadiusSq));
    }
}