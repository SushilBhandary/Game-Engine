export class Buffer {
    constructor(gl, type, usage) {
        this.gl = gl;
        this.type = type;
        this.buffer = gl.createBuffer();
        this.usage = usage || gl.STATIC_DRAW;
    }

    bind() {
        this.gl.bindBuffer(this.type, this.buffer);
    }

    unbind() {
        this.gl.bindBuffer(this.type, null);
    }

    setData(data) {
        this.bind();
        if (data instanceof Float32Array) {
            this.gl.bufferData(this.type, data, this.usage);
        } else {
            this.gl.bufferData(this.type, new Float32Array(data), this.usage);
        }
    }

    delete() {
        this.gl.deleteBuffer(this.buffer);
    }
}

export class VertexBuffer extends Buffer {
    constructor(gl, data, usage) {
        super(gl, gl.ARRAY_BUFFER, usage);
        if (data) {
            this.setData(data);
        }
    }
}

export class IndexBuffer extends Buffer {
    constructor(gl, data, usage) {
        super(gl, gl.ELEMENT_ARRAY_BUFFER, usage);
        if (data) {
            this.setData(new Uint16Array(data));
        }
    }

    setData(data) {
        this.bind();
        if (data instanceof Uint16Array) {
            this.gl.bufferData(this.type, data, this.usage);
        } else {
            this.gl.bufferData(this.type, new Uint16Array(data), this.usage);
        }
    }
}