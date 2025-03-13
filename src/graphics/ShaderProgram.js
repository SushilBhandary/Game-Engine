export class ShaderProgram {
    constructor(gl, vertexSource, fragmentSource) {
        this.gl = gl;
        this.program = null;
        this.attributes = new Map();
        this.uniforms = new Map();
        
        this.createProgram(vertexSource, fragmentSource);
        this.detectAttributes();
        this.detectUniforms();
    }

    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        if (!vertexShader || !fragmentShader) {
            return null;
        }

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Failed to link program:', this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program);
            return null;
        }

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(
                `Shader compilation error: ${this.gl.getShaderInfoLog(shader)}`
            );
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    detectAttributes() {
        const attribCount = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attribCount; i++) {
            const attribInfo = this.gl.getActiveAttrib(this.program, i);
            if (attribInfo) {
                const location = this.gl.getAttribLocation(this.program, attribInfo.name);
                this.attributes.set(attribInfo.name, {
                    location,
                    type: attribInfo.type,
                    size: attribInfo.size
                });
            }
        }
    }

    detectUniforms() {
        const uniformCount = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = this.gl.getActiveUniform(this.program, i);
            if (uniformInfo) {
                const location = this.gl.getUniformLocation(this.program, uniformInfo.name);
                this.uniforms.set(uniformInfo.name, {
                    location,
                    type: uniformInfo.type,
                    size: uniformInfo.size
                });
            }
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform(name, value) {
        const uniform = this.uniforms.get(name);
        if (!uniform) {
            console.warn(`Uniform ${name} not found in shader program`);
            return;
        }

        const gl = this.gl;
        switch (uniform.type) {
            case gl.FLOAT:
                gl.uniform1f(uniform.location, value);
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2fv(uniform.location, value);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3fv(uniform.location, value);
                break;
            case gl.FLOAT_VEC4:
                gl.uniform4fv(uniform.location, value);
                break;
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(uniform.location, false, value);
                break;
            case gl.INT:
            case gl.SAMPLER_2D:
                gl.uniform1i(uniform.location, value);
                break;
            default:
                console.warn(`Unsupported uniform type: ${uniform.type}`);
        }
    }

    getAttributeLocation(name) {
        const attribute = this.attributes.get(name);
        return attribute ? attribute.location : -1;
    }
}