export class TextureLoader {
    constructor(gl) {
        this.gl = gl;
        this.textures = new Map();
    }

    async load(url) {
        if (this.textures.has(url)) {
            return this.textures.get(url);
        }

        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';

            image.onload = () => {
                const texture = this.createTexture(image);
                this.textures.set(url, texture);
                resolve(texture);
            };

            image.onerror = () => {
                reject(new Error(`Failed to load texture: ${url}`));
            };

            image.src = url;
        });
    }

    createTexture(image) {
        const gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Upload the image into the texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        return texture;
    }

    delete(url) {
        const texture = this.textures.get(url);
        if (texture) {
            this.gl.deleteTexture(texture);
            this.textures.delete(url);
        }
    }
}