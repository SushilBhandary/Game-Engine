import { Engine } from '../../../src/main.js';
import { PlayerController } from './PlayerController.js';

class PlatformerGame {
    constructor() {
        this.engine = new Engine();
        this.setupGame();
    }

    async setupGame() {
        // Load assets
        const textures = await Promise.all([
            this.engine.assetManager.load('texture', 'player', 'assets/player.png'),
            this.engine.assetManager.load('texture', 'platform', 'assets/platform.png'),
            this.engine.assetManager.load('texture', 'background', 'assets/background.png')
        ]);

        // Set up camera
        this.engine.renderer.setActiveCamera(this.engine.renderer.camera2D);

        // Create background
        const background = this.engine.renderer.createGameObject('background');
        background.addComponent('sprite', {
            texture: textures[2],
            width: 800,
            height: 600
        });

        // Create player
        const player = this.engine.renderer.createGameObject('player');
        player.addComponent('sprite', {
            texture: textures[0],
            width: 32,
            height: 32
        });
        player.addComponent('rigidBody', {
            mass: 1,
            useGravity: true
        });
        player.addComponent('boxCollider', {
            width: 32,
            height: 32
        });
        player.addScript(new PlayerController());

        // Create platforms
        this.createPlatform(400, 500, 800, 32);
        this.createPlatform(200, 400, 200, 32);
        this.createPlatform(600, 300, 200, 32);
    }

    createPlatform(x, y, width, height) {
        const platform = this.engine.renderer.createGameObject('platform');
        platform.transform.position = [x, y, 0];
        platform.addComponent('sprite', {
            texture: this.engine.assetManager.get('platform'),
            width: width,
            height: height
        });
        platform.addComponent('boxCollider', {
            width: width,
            height: height,
            isStatic: true
        });
    }
}

new PlatformerGame();