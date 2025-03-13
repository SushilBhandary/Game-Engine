

import { ShaderProgram } from './ShaderProgram.js';
import { VertexBuffer, IndexBuffer } from './Buffer.js';
import { VertexArray } from './VertexArray.js';
import { mat4 } from 'gl-matrix';
import { Camera3D } from './cameras/Camera3D.js';
import { Camera2D } from './cameras/Camera2D.js';
import { GameObject } from '../scene/GameObject.js';
import { TextureLoader } from './TextureLoader.js';
import { ModelLoader } from './ModelLoader.js';
import { DebugRenderer } from './DebugRenderer.js';
import { BatchRenderer } from './BatchRenderer.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');

        if (!this.gl) {
            throw new Error('WebGL2 is not available in your browser');
        }

        this.initializeWebGL();
        this.shaders = new Map();
        this.shaderPrograms = new Map();
        this.vertexArrays = new Map();
        this.vertexBuffers = new Map();
        this.indexBuffers = new Map();

        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        
        // Set up default camera position
        mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
        mat4.lookAt(this.viewMatrix, [0, 0, 5], [0, 0, 0], [0, 1, 0]);

        // Initialize default 3D camera
        this.camera3D = new Camera3D();
        this.camera3D.setAspect(canvas.width / canvas.height);

        // Initialize default 2D camera
        this.camera2D = new Camera2D();
        this.camera2D.setSize(canvas.width, canvas.height);

        // Current active camera
        this.activeCamera = this.camera3D;
        
        this.gameObjects = new Map();
        this.textureLoader = new TextureLoader(this.gl);
        this.debugRenderer = new DebugRenderer(this.gl);
        this.batchRenderer = new BatchRenderer(this.gl);
    }

    setActiveCamera(camera) {
        this.activeCamera = camera;
    }

    resize(width, height) {
        this.gl.viewport(0, 0, width, height);
        this.camera3D.setAspect(width / height);
        this.camera2D.setSize(width, height);
    }

    render(mesh, node, shader) {
        shader.use();
        
        // Update and set matrices using active camera and world transform
        shader.setUniform('projectionMatrix', this.activeCamera.getProjectionMatrix());
        shader.setUniform('viewMatrix', this.activeCamera.getViewMatrix());
        shader.setUniform('modelMatrix', node.getWorldMatrix());

        mesh.vao.bind();
        this.gl.drawElements(
            this.gl.TRIANGLES,
            mesh.indexCount,
            this.gl.UNSIGNED_SHORT,
            0
        );
        mesh.vao.unbind();
    }

    createGameObject(name, meshData = null, material = null) {
        let mesh = null;
        if (meshData) {
            mesh = this.createMesh(name + '_mesh', 
                meshData.vertices, 
                meshData.indices, 
                meshData.attributes
            );
        }

        const gameObject = new GameObject(name, mesh, material);
        this.gameObjects.set(name, gameObject);
        return gameObject;
    }

    createMesh(name, vertices, indices, attributes) {
        const vao = this.createVertexArray(name);
        const vbo = this.createVertexBuffer(name + '_vbo', vertices);
        const ibo = this.createIndexBuffer(name + '_ibo', indices);

        vao.bind();
        vbo.bind();
        ibo.bind();

        for (const [location, attr] of Object.entries(attributes)) {
            vao.setAttribute(
                parseInt(location),
                attr.size,
                this.gl.FLOAT,
                false,
                attr.stride || 0,
                attr.offset || 0
            );
        }

        vao.unbind();
        return { vao, vbo, ibo, indexCount: indices.length };
    }

    render(gameObject, shader) {
        if (!gameObject.mesh) return;

        shader.use();
        
        shader.setUniform('projectionMatrix', this.activeCamera.getProjectionMatrix());
        shader.setUniform('viewMatrix', this.activeCamera.getViewMatrix());
        shader.setUniform('modelMatrix', gameObject.transform.updateModelMatrix());

        if (gameObject.material) {
            gameObject.material.apply(shader);
        }

        gameObject.mesh.vao.bind();
        this.gl.drawElements(
            this.gl.TRIANGLES,
            gameObject.mesh.indexCount,
            this.gl.UNSIGNED_SHORT,
            0
        );
        gameObject.mesh.vao.unbind();
    }

    async loadTexture(url) {
        return await this.textureLoader.load(url);
    }

    // Add method to bind texture to a shader
    bindTexture(texture, uniformLocation, textureUnit = 0) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniformLocation, textureUnit);
    }

    async loadModel(url) {
        const modelData = await ModelLoader.loadOBJ(url);
        
        // Create attributes object for mesh creation
        const attributes = {
            0: { size: 3, stride: 0, offset: 0 }  // position
        };

        if (modelData.normals.length > 0) {
            attributes[1] = { size: 3, stride: 0, offset: 0 };  // normal
        }

        if (modelData.texCoords.length > 0) {
            attributes[2] = { size: 2, stride: 0, offset: 0 };  // texCoord
        }

        // Create and return mesh
        return this.createMesh(
            url.split('/').pop(),  // Use filename as mesh name
            modelData.vertices,
            modelData.indices,
            attributes
        );
    }

    async createModelGameObject(name, modelUrl) {
        const mesh = await this.loadModel(modelUrl);
        return this.createGameObject(name, mesh);
    }

    renderDebug(camera) {
        this.debugRenderer.render(camera);
    }

    drawDebugAABB(aabb, color) {
        this.debugRenderer.drawAABB(aabb, color);
    }

    drawDebugAxes(length) {
        this.debugRenderer.drawAxes(length);
    }

    drawDebugLine(start, end, color) {
        this.debugRenderer.drawLine(start, end, color);
    }

    renderBatch(gameObjects, shader) {
        // Clear previous batches
        this.batchRenderer.clear();

        // Sort objects by texture to minimize state changes
        const sortedObjects = gameObjects.sort((a, b) => {
            const textureA = a.material?.texture || null;
            const textureB = b.material?.texture || null;
            return (textureA?.id || 0) - (textureB?.id || 0);
        });

        // Add objects to batches
        for (const obj of sortedObjects) {
            if (obj.mesh && obj.material) {
                this.batchRenderer.addToBatch(
                    obj,
                    obj.mesh,
                    obj.material.texture
                );
            }
        }

        // Render all batches
        this.batchRenderer.render(shader, this.activeCamera);
    }
}