export class VertexArray {
    constructor(gl) {
        this.gl = gl;
        this.vao = gl.createVertexArray();
        this.attributes = new Map();
    }

    bind() {
        this.gl.bindVertexArray(this.vao);
    }

    unbind() {
        this.gl.bindVertexArray(null);
    }

    setAttribute(location, size, type, normalized, stride, offset) {
        this.bind();
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(
            location,
            size,
            type,
            normalized,
            stride,
            offset
        );
        this.attributes.set(location, { size, type, normalized, stride, offset });
    }

    delete() {
        this.gl.deleteVertexArray(this.vao);
    }
}