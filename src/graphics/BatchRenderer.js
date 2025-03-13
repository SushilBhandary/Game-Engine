import { mat4 } from 'gl-matrix';

export class BatchRenderer {
    constructor(gl) {
        this.gl = gl;
        this.maxBatchSize = 1000;
        this.batches = new Map(); // Texture -> Batch
    }

    createBatch(texture) {
        return {
            texture,
            vertices: [],
            indices: [],
            transforms: [],
            count: 0,
            vertexBuffer: this.gl.createBuffer(),
            indexBuffer: this.gl.createBuffer(),
            transformBuffer: this.gl.createBuffer()
        };
    }

    addToBatch(gameObject, mesh, texture) {
        let batch = this.batches.get(texture);
        if (!batch) {
            batch = this.createBatch(texture);
            this.batches.set(texture, batch);
        }

        if (batch.count >= this.maxBatchSize) {
            this.flushBatch(batch);
        }

        // Add mesh data to batch
        const baseVertex = batch.vertices.length / 3;
        batch.vertices.push(...mesh.vertices);
        
        // Add indices with offset
        for (const index of mesh.indices) {
            batch.indices.push(index + baseVertex);
        }

        // Add transform matrix
        batch.transforms.push(...gameObject.transform.getWorldMatrix());
        batch.count++;
    }

    flushBatch(batch) {
        const gl = this.gl;

        // Update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, batch.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batch.vertices), gl.DYNAMIC_DRAW);

        // Update index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, batch.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(batch.indices), gl.DYNAMIC_DRAW);

        // Update transform buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, batch.transformBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(batch.transforms), gl.DYNAMIC_DRAW);

        // Clear batch data
        batch.vertices = [];
        batch.indices = [];
        batch.transforms = [];
        batch.count = 0;
    }

    render(shader, camera) {
        const gl = this.gl;
        shader.use();

        // Set camera uniforms
        shader.setUniform('viewMatrix', camera.getViewMatrix());
        shader.setUniform('projectionMatrix', camera.getProjectionMatrix());

        for (const batch of this.batches.values()) {
            if (batch.count === 0) continue;

            // Bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, batch.texture);
            shader.setUniform('uTexture', 0);

            // Set up vertex attributes
            gl.bindBuffer(gl.ARRAY_BUFFER, batch.vertexBuffer);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            // Set up transform attributes
            gl.bindBuffer(gl.ARRAY_BUFFER, batch.transformBuffer);
            for (let i = 0; i < 4; i++) {
                const location = shader.getAttribLocation(`aTransform${i}`);
                gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 64, i * 16);
                gl.enableVertexAttribArray(location);
                gl.vertexAttribDivisor(location, 1);
            }

            // Draw batch
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, batch.indexBuffer);
            gl.drawElementsInstanced(
                gl.TRIANGLES,
                batch.indices.length,
                gl.UNSIGNED_SHORT,
                0,
                batch.count
            );

            // Reset instance attribute divisor
            for (let i = 0; i < 4; i++) {
                const location = shader.getAttribLocation(`aTransform${i}`);
                gl.vertexAttribDivisor(location, 0);
            }
        }
    }

    clear() {
        this.batches.clear();
    }
}