export class ModelLoader {
    static async loadOBJ(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            return ModelLoader.parseOBJ(text);
        } catch (error) {
            throw new Error(`Failed to load model: ${url}`);
        }
    }

    static parseOBJ(text) {
        const vertices = [];
        const normals = [];
        const texCoords = [];
        const indices = [];
        const positions = [];
        const finalNormals = [];
        const finalTexCoords = [];

        const lines = text.split('\n');
        let vertexCount = 0;

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            
            switch (parts[0]) {
                case 'v':  // Vertex position
                    vertices.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                    break;
                    
                case 'vn': // Vertex normal
                    normals.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    );
                    break;
                    
                case 'vt': // Texture coordinate
                    texCoords.push(
                        parseFloat(parts[1]),
                        parseFloat(parts[2])
                    );
                    break;
                    
                case 'f':  // Face
                    // Convert face data to triangles
                    for (let i = 1; i <= 3; i++) {
                        const vertexData = parts[i].split('/');
                        
                        // OBJ indices are 1-based
                        const vertexIndex = parseInt(vertexData[0]) - 1;
                        const texCoordIndex = vertexData[1] ? parseInt(vertexData[1]) - 1 : -1;
                        const normalIndex = vertexData[2] ? parseInt(vertexData[2]) - 1 : -1;

                        // Add vertex position
                        positions.push(
                            vertices[vertexIndex * 3],
                            vertices[vertexIndex * 3 + 1],
                            vertices[vertexIndex * 3 + 2]
                        );

                        // Add texture coordinate if available
                        if (texCoordIndex >= 0) {
                            finalTexCoords.push(
                                texCoords[texCoordIndex * 2],
                                texCoords[texCoordIndex * 2 + 1]
                            );
                        }

                        // Add normal if available
                        if (normalIndex >= 0) {
                            finalNormals.push(
                                normals[normalIndex * 3],
                                normals[normalIndex * 3 + 1],
                                normals[normalIndex * 3 + 2]
                            );
                        }

                        indices.push(vertexCount++);
                    }
                    break;
            }
        }

        return {
            vertices: new Float32Array(positions),
            normals: new Float32Array(finalNormals),
            texCoords: new Float32Array(finalTexCoords),
            indices: new Uint16Array(indices)
        };
    }
}