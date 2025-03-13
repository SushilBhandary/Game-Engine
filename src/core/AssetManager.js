export class AssetManager {
    constructor() {
        this.assets = new Map();
        this.loadingAssets = new Map();
    }

    async load(type, id, url) {
        if (this.assets.has(id)) {
            return this.assets.get(id);
        }

        if (this.loadingAssets.has(id)) {
            return this.loadingAssets.get(id);
        }

        let loadPromise;
        switch (type) {
            case 'texture':
                loadPromise = this.loadTexture(url);
                break;
            case 'model':
                loadPromise = this.loadModel(url);
                break;
            case 'audio':
                loadPromise = this.loadAudio(url);
                break;
            default:
                throw new Error(`Unsupported asset type: ${type}`);
        }

        this.loadingAssets.set(id, loadPromise);

        try {
            const asset = await loadPromise;
            this.assets.set(id, asset);
            this.loadingAssets.delete(id);
            return asset;
        } catch (error) {
            this.loadingAssets.delete(id);
            throw error;
        }
    }

    get(id) {
        return this.assets.get(id);
    }

    async loadTexture(url) {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        return new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
            image.src = url;
        });
    }

    async loadModel(url) {
        const response = await fetch(url);
        return response.json();
    }

    async loadAudio(url) {
        const audio = new Audio();
        return new Promise((resolve, reject) => {
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Failed to load audio: ${url}`));
            audio.src = url;
        });
    }

    unload(id) {
        this.assets.delete(id);
    }

    clear() {
        this.assets.clear();
        this.loadingAssets.clear();
    }
}