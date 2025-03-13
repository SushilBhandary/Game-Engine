import { Canvas } from './core/Canvas.js';
import { Renderer } from './graphics/Renderer.js';
import { Time } from './core/Time.js';
import { Input } from './core/Input.js';
import { GameLoop } from './core/GameLoop.js';
import { defaultVertexShader, defaultFragmentShader } from './graphics/shaders/defaultShaders.js';
import { Transform } from './core/Transform.js';
import { Scene } from './scene/Scene.js';
import { AABB } from './scene/AABB.js';
import { vec3 } from 'gl-matrix';
import { PhysicsSystem } from './physics/PhysicsSystem.js';
import { AssetManager } from './core/AssetManager.js';
import { ScriptSystem } from './scripting/ScriptSystem.js';
import { Logger } from './core/Logger.js';

class Engine {
    constructor() {
        this.logger = new Logger();
        
        try {
            this.canvas = new Canvas();
            this.logger.info('Canvas initialized successfully');
            
            this.renderer = new Renderer(this.canvas.element);
            this.logger.info('Renderer initialized successfully');
            
            this.time = new Time();
            this.input = new Input(this.canvas.element);
            this.gameLoop = new GameLoop(this);

            this.canvas.element.addEventListener('resize', () => {
                this.renderer.resize(this.canvas.width, this.canvas.height);
            });

            // Initialize default shader program
            this.renderer.createShaderProgram('default', defaultVertexShader, defaultFragmentShader);

            // Initialize scene
            this.scene = new Scene();

            // Create a triangle game object
            const triangleData = {
                vertices: [
                    -0.5, -0.5, 0.0,  // Position 0
                     0.5, -0.5, 0.0,  // Position 1
                     0.0,  0.5, 0.0,  // Position 2
                ],
                indices: [0, 1, 2],
                attributes: {
                    0: { size: 3, stride: 0, offset: 0 } // position attribute
                }
            };

            // Create root game object
            const rootObject = this.renderer.createGameObject('root');
            this.scene.addGameObject(rootObject);

            // Create triangle as child of root
            const triangleObject = this.renderer.createGameObject('triangle', triangleData);
            this.scene.addGameObject(triangleObject, 'root');
            
            // Add child objects
            const childObject1 = this.renderer.createGameObject('child1', triangleData);
            this.scene.addGameObject(childObject1, 'triangle');
            childObject1.transform.position[0] = 2; // Offset right

            const childObject2 = this.renderer.createGameObject('child2', triangleData);
            this.scene.addGameObject(childObject2, 'triangle');
            childObject2.transform.position[0] = -2; // Offset left

            // Add rotation behavior
            triangleObject.addComponent('rotator', {
                update: (deltaTime) => {
                    triangleObject.transform.rotation[1] += 0.01;
                }
            });
            
            // In your Engine class constructor
            // Define box mesh data
            const boxMeshData = {
                vertices: [
                    // Front face
                    -0.5, -0.5,  0.5,
                     0.5, -0.5,  0.5,
                     0.5,  0.5,  0.5,
                    -0.5,  0.5,  0.5,
                    // Back face
                    -0.5, -0.5, -0.5,
                    -0.5,  0.5, -0.5,
                     0.5,  0.5, -0.5,
                     0.5, -0.5, -0.5,
                ],
                indices: [
                    0, 1, 2,    0, 2, 3,    // front
                    4, 5, 6,    4, 6, 7,    // back
                    5, 3, 2,    5, 2, 6,    // top
                    4, 7, 1,    4, 1, 0,    // bottom
                    7, 6, 2,    7, 2, 1,    // right
                    4, 0, 3,    4, 3, 5     // left
                ],
                attributes: {
                    0: { size: 3, stride: 0, offset: 0 } // position attribute
                }
            };

            // Define sphere mesh data (simplified UV sphere)
            const sphereMeshData = this.createUVSphere(1, 16, 16);

            // Create physics objects
            const box1 = this.renderer.createGameObject('box1', boxMeshData);
            const box2 = this.renderer.createGameObject('box2', boxMeshData);
            
            // Create and add AABB colliders
            const box1Collider = AABB.fromPoints(boxMeshData.vertices);
            const box2Collider = AABB.fromPoints(boxMeshData.vertices);
            
            this.scene.addGameObject(box1);
            this.scene.addGameObject(box2);
            this.scene.addCollider(box1, box1Collider);
            this.scene.addCollider(box2, box2Collider);
            
            // Add collision response
            box1.onCollision = (other) => {
                console.log(`Box1 collided with ${other.name}`);
            };
            
            // In Engine constructor
            this.physicsSystem = new PhysicsSystem();
            this.scriptSystem = new ScriptSystem();
            
            // Example script attachment
            const playerScript = this.scriptSystem.addScript(ball, PlayerController, {
                moveSpeed: 5,
                jumpForce: 10
            });
        } catch (error) {
            this.logger.error(`Engine initialization failed: ${error.message}`);
            throw error;
        }
    }

    update() {
        try {
            this.physicsSystem.update(this.time.getDeltaTime());
            this.scriptSystem.update(this.time.getDeltaTime());
            this.scene.update(this.time.getDeltaTime());
        } catch (error) {
            this.logger.error(`Update cycle failed: ${error.message}`);
        }
    }

    render() {
        try {
            this.renderer.clear();
            const shader = this.renderer.getShaderProgram('default');
            this.scene.render(this.renderer, shader);

            if (this.debugMode) {
                this.scene.forEachCollider((gameObject, collider) => {
                    this.renderer.drawDebugAABB(collider, [0, 1, 0]);
                });
                this.renderer.drawDebugAxes(5);
            }

            this.renderer.renderDebug(this.renderer.activeCamera);
        } catch (error) {
            this.logger.error(`Render cycle failed: ${error.message}`);
        }
    }
}