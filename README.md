# 3D Model Interaction GUI

This project features a GUI that allows users to interact with a 3D scene by resetting specific objects to their initial transformations and selecting individual parts of the model for highlighting.

## Features

### 1. Reset Button

The reset button in the GUI is used to return specific objects in the scene to their initial transformations, effectively "resetting" their position and rotation.

#### Purpose
The reset button restores all objects in `group2` (which includes the 3D model) and the `meshBox` to their original positions and rotations.

#### Implementation
- At initialization, each mesh in `group2` saves its starting position and rotation in the `initialTransforms` dictionary. This is done so the objects can return to these initial values upon reset.
- When reset is triggered, it loops over all children in `group2`. For each child:
  - If it is a mesh (3D object with geometry and material), it retrieves its initial position and rotation from `initialTransforms`.
  - The position and rotation of each child are then set back to these initial values.
- Additional Reset Effects:
  - The reset function also adjusts the `meshBox` position and rotation to a preset configuration:
    ```javascript
    meshBox.position.set(0.3, 1.3, -3.3);
    meshBox.rotation.set(0, Math.PI / 2, 0);
    ```

#### Code Example of Reset Button Setup

```javascript
let guiPros = {
  changeX: 0,
  reset: () => {
    group2.traverse((child) => {
      if (child.isMesh) {
        const initial = initialTransforms[child.name];
        if (initial) {
          child.position.copy(initial.position);
          child.rotation.copy(initial.rotation);
        }
      }
    });
    meshBox.position.set(0.3, 1.3, -3.3);
    meshBox.rotation.set(0, Math.PI / 2, 0);
  },
};

// Adding reset button to the GUI
const reset = gui.add(guiPros, "reset");
