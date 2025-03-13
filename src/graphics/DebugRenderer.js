import { vec3, mat4 } from 'gl-matrix';

export class DebugRenderer {
    constructor(gl) {
        this.gl = gl;
        this.lines = [];
        this.initShaders();
        this.initBuffers();
    }

    initShaders() {
        const vertexShader = `
            attribute vec3 aPosition;
            attribute vec3 aColor;
            uniform mat4 uModelViewProjection;
            varying vec3 vColor;
            
            void main() {
                gl_Position = uModelViewProjection * vec4(aPosition, 1.0);
                vColor = aColor;
            }
        `;

        const fragmentShader = `
            precision mediump float;
            varying vec3 vColor;
            
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;

        // Create shader program
        this.program = createShaderProgram(this.gl, vertexShader, fragmentShader);
        this.positionLocation = this.gl.getAttribLocation(this.program, 'aPosition');
        this.colorLocation = this.gl.getAttribLocation(this.program, 'aColor');
        this.mvpLocation = this.gl.getUniformLocation(this.program, 'uModelViewProjection');
    }

    initBuffers() {
        this.vertexBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
    }

    drawLine(start, end, color = [1, 1, 1]) {
        this.lines.push({
            start: vec3.clone(start),
            end: vec3.clone(end),
            color: color
        });
    }

    drawAABB(aabb, color = [0, 1, 0]) {
        const { min, max } = aabb;
        
        // Draw box edges
        this.drawLine([min[0], min[1], min[2]], [max[0], min[1], min[2]], color);
        this.drawLine([min[0], min[1], min[2]], [min[0], max[1], min[2]], color);
        this.drawLine([min[0], min[1], min[2]], [min[0], min[1], max[2]], color);
        this.drawLine([max[0], max[1], max[2]], [min[0], max[1], max[2]], color);
        this.drawLine([max[0], max[1], max[2]], [max[0], min[1], max[2]], color);
        this.drawLine([max[0], max[1], max[2]], [max[0], max[1], min[2]], color);
        this.drawLine([max[0], min[1], min[2]], [max[0], max[1], min[2]], color);
        this.drawLine([max[0], min[1], min[2]], [max[0], min[1], max[2]], color);
        this.drawLine([min[0], max[1], min[2]], [max[0], max[1], min[2]], color);
        this.drawLine([min[0], max[1], min[2]], [min[0], max[1], max[2]], color);
        this.drawLine([min[0], min[1], max[2]], [max[0], min[1], max[2]], color);
        this.drawLine([min[0], min[1], max[2]], [min[0], max[1], max[2]], color);
    }

    drawAxes(length = 1) {
        this.drawLine([0, 0, 0], [length, 0, 0], [1, 0, 0]); // X axis (red)
        this.drawLine([0, 0, 0], [0, length, 0], [0, 1, 0]); // Y axis (green)
        this.drawLine([0, 0, 0], [0, 0, length], [0, 0, 1]); // Z axis (blue)
    }

    render(camera) {
        if (this.lines.length === 0) return;

        const gl = this.gl;
        const vertices = [];
        const colors = [];

        // Prepare line data
        for (const line of this.lines) {
            vertices.push(...line.start, ...line.end);
            colors.push(...line.color, ...line.color);
        }

        // Update buffers
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.colorLocation, 3, gl.FLOAT, false, 0, 0);

        // Set MVP matrix
        const mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, camera.getProjectionMatrix(), camera.getViewMatrix());
        gl.uniformMatrix4fv(this.mvpLocation, false, mvpMatrix);

        // Draw lines
        gl.enable(gl.DEPTH_TEST);
        gl.lineWidth(2);
        gl.drawArrays(gl.LINES, 0, this.lines.length * 2);

        // Clear lines for next frame
        this.lines = [];
    }
}