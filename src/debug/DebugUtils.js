export class DebugUtils {
    static drawDebugData(gl, vertices, colors) {
        const shader = this.getDebugShader(gl);
        shader.use();

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        gl.drawArrays(gl.LINES, 0, vertices.length / 3);
    }

    static log(message, severity = 'info') {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${severity.toUpperCase()}] ${message}`;

        switch (severity) {
            case 'debug':
                console.debug(formattedMessage);
                break;
            case 'info':
                console.info(formattedMessage);
                break;
            case 'warning':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }
    }
}