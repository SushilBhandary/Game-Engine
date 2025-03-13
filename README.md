# Trae Game Engine

A lightweight WebGL-based game engine for building 2D and 3D games.

## Features

- WebGL2 rendering pipeline
- 2D and 3D camera systems
- Physics simulation with collision detection
- Entity Component System (ECS)
- Asset management system
- Spatial partitioning for optimization
- Debug rendering tools
- Input handling system
- Scene graph management
- Batch rendering support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser with WebGL2 support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trae-game-engine.git
```

2. Install dependencies:
```bash
npm install
```

3. tart the development server:
```bash
npm start
```

### Running Examples
The engine comes with example projects demonstrating various features:

- 2D Platformer:
```bash
npm run example:2d
```
- 3D Space Shooter:
```bash
npm run example:3d
```
- View all examples:
```bash
npm run examples
```

# Usage
## Basic Setup
```javascript

import { Engine } from 'trae-engine';

// Create engine instance
const engine = new Engine();

// Create a game object
const gameObject = engine.renderer.createGameObject('player');

// Add components
gameObject.addComponent('sprite', {
    texture: 'player.png',
    width: 32,
    height: 32
});

// Add physics
gameObject.addComponent('rigidBody', {
    mass: 1,
    useGravity: true
});

// Add to scene
engine.scene.addGameObject(gameObject);
```

### Documentation
Generate API documentation:

```bash
npm run docs
```
View the documentation in your browser at docs/index.html.

# Project Structure
src/
├── core/           # Core engine systems
├── graphics/       # Rendering and shader systems
├── physics/        # Physics and collision systems
├── scene/         # Scene management
├── scripting/     # Scripting system
├── assets/        # Asset management
└── debug/         # Debug utilities

examples/
├── 2D/            # 2D game examples
└── 3D/            # 3D game examples

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License
This project is licensed under the ISC License - see the LICENSE file for details.

# Acknowledgments
- gl-matrix for matrix and vector operations
- WebGL2 for 3D graphics rendering