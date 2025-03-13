export class RenderUtils {
    static createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program: ' + gl.getProgramInfoLog(program));
        }

        return program;
    }

    static createBuffer(gl, data, type, usage = gl.STATIC_DRAW) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, usage);
        return buffer;
    }

    static renderScene(gl, scene, camera) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();

        scene.traverse((object) => {
            if (object.mesh && object.material) {
                object.material.shader.use();
                object.material.shader.setUniform('viewMatrix', viewMatrix);
                object.material.shader.setUniform('projectionMatrix', projectionMatrix);
                object.material.shader.setUniform('modelMatrix', object.transform.getWorldMatrix());
                
                object.mesh.draw();
            }
        });
    }

    static createCamera(type, parameters) {
        switch (type) {
            case '2d':
                return new Camera2D(parameters);
            case '3d':
                return new Camera3D(parameters);
            default:
                throw new Error('Unknown camera type');
        }
    }
}