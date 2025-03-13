export class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loading = new Map();
    }

    async loadTexture(gl, url) {
        if (this.assets.has(url)) return this.assets.get(url);
        if (this.loading.has(url)) return this.loading.get(url);

        const loadPromise = new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const texture = this.createGLTexture(gl, image);
                this.assets.set(url, texture);
                this.loading.delete(url);
                resolve(texture);
            };
            image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
            image.src = url;
        });

        this.loading.set(url, loadPromise);
        return loadPromise;
    }

    async loadModel(url) {
        if (this.assets.has(url)) return this.assets.get(url);
        if (this.loading.has(url)) return this.loading.get(url);

        const loadPromise = fetch(url)
            .then(response => response.json())
            .then(data => {
                this.assets.set(url, data);
                this.loading.delete(url);
                return data;
            });

        this.loading.set(url, loadPromise);
        return loadPromise;
    }

    getAsset(assetId) {
        return this.assets.get(assetId);
    }
}