# Adding Rotation Controls to the GUI

This section provides a guide on adding rotation controls for `rotateX`, `rotateY`, and `rotateZ` properties to the GUI, allowing real-time updates to the rotation of the selected 3D model part.

## Steps

### Step 1: Define Rotation Properties

Extend the `guiPros` object with properties for each rotation axis (`rotateX`, `rotateY`, `rotateZ`) and set default values.

```javascript
let guiPros = {
  changeX: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
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
    guiPros.rotateX = 0;
    guiPros.rotateY = 0;
    guiPros.rotateZ = 0;
  },
};
