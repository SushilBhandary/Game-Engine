export class Shader {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = this.createProgram(vertexSource, fragmentSource);
        this.uniforms = new Map();
        this.attributes = new Map();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(`Program linking error: ${this.gl.getProgramInfoLog(program)}`);
            return null;
        }

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        return program;
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform(name, value) {
        if (!this.uniforms.has(name)) {
            const location = this.gl.getUniformLocation(this.program, name);
            this.uniforms.set(name, location);
        }
        // Add type checking and appropriate gl.uniform* calls here
    }
}