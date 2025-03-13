export const batchVertexShader = `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    attribute vec4 aTransform0;
    attribute vec4 aTransform1;
    attribute vec4 aTransform2;
    attribute vec4 aTransform3;
    
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    
    varying vec2 vTexCoord;
    
    void main() {
        mat4 modelMatrix = mat4(
            aTransform0,
            aTransform1,
            aTransform2,
            aTransform3
        );
        
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
        vTexCoord = aTexCoord;
    }
`;

export const batchFragmentShader = `
    precision mediump float;
    
    uniform sampler2D uTexture;
    varying vec2 vTexCoord;
    
    void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
    }
`;