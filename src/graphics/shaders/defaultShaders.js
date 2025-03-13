export const defaultVertexShader = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying vec2 vTexCoord;
    
    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        vTexCoord = aTexCoord;
    }
`;

export const defaultFragmentShader = `
    precision mediump float;
    
    uniform sampler2D uTexture;
    varying vec2 vTexCoord;
    
    void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
    }
`;