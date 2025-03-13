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

    intersects(other) {
        return (this.min[0] <= other.max[0] && this.max[0] >= other.min[0]) &&
               (this.min[1] <= other.max[1] && this.max[1] >= other.min[1]) &&
               (this.min[2] <= other.max[2] && this.max[2] >= other.min[2]);
    }

    transform(position) {
        const transformedMin = vec3.add(vec3.create(), this.min, position);
        const transformedMax = vec3.add(vec3.create(), this.max, position);
        return new AABB(transformedMin, transformedMax);
    }
}