import { Engine } from '../../../src/main.js';
import { SpaceshipController } from './SpaceshipController.js';
import { AsteroidSpawner } from './AsteroidSpawner.js';

class SpaceShooterGame {
    constructor() {
        this.engine = new Engine();
        this.setupGame();
    }

    async setupGame() {
        // Load assets
        const models = await Promise.all([
            this.engine.assetManager.load('model', 'spaceship', 'assets/spaceship.obj'),
            this.engine.assetManager.load('model', 'asteroid', 'assets/asteroid.obj'),
            this.engine.assetManager.load('model', 'laser', 'assets/laser.obj')
        ]);

        // Set up camera
        const camera = this.engine.renderer.camera3D;
        camera.position = [0, 5, -15];
        camera.lookAt([0, 0, 0]);

        // Create player spaceship
        const spaceship = this.engine.renderer.createModelGameObject('spaceship', models[0]);
        spaceship.addComponent('rigidBody', {
            mass: 1,
            useGravity: false,
            drag: 0.1
        });
        spaceship.addComponent('sphereCollider', {
            radius: 1
        });
        spaceship.addScript(new SpaceshipController());

        // Create asteroid spawner
        const spawner = new AsteroidSpawner(this.engine, models[1]);
        this.engine.scene.addGameObject(spawner);

        // Set up skybox
        this.setupSkybox();
    }

    setupSkybox() {
        const skyboxTextures = [
            'assets/skybox/right.jpg',
            'assets/skybox/left.jpg',
            'assets/skybox/top.jpg',
            'assets/skybox/bottom.jpg',
            'assets/skybox/front.jpg',
            'assets/skybox/back.jpg'
        ];

        this.engine.renderer.createSkybox(skyboxTextures);
    }
}

new SpaceShooterGame();