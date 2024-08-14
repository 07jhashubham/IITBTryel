## Features of the Three.js Project

### Interaction
- **Orbit Controls**: Enables mouse-based scene interaction.
- **VR/XR Support**: Integrates WebXR with hand tracking using Oculus devices.
- **Controller Models**: Adds VR controllers and hand models for interaction.

### `lil-gui` Integration
- **Folder Organization**: Uses a `"Model Parts"` folder for better GUI management.
- **Dynamic Buttons**: Creates buttons for each part of the model inside the folder.
- **Part Highlighting**: Highlights selected parts by changing their emissive color.
- **Transform Controls**: Includes controls for adjusting and resetting the model's position.

### Advanced Features
- **HTMLMesh GUI**: Renders the GUI as a 3D mesh within the scene, scalable and VR-ready.
- **Raycasting**: Detects interactions with objects and GUI elements.
- **Continuous Rendering**: Uses an animation loop for smooth interactions.
