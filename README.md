# Key Features of HTMLMesh

### 1. Embedding HTML Content in 3D Space
HTMLMesh allows you to embed any HTML element within your Three.js scene, rendering it as a texture mapped onto a 3D object. This feature enables you to add interactive HTML forms, text, or other UI elements that users can interact with directly within the 3D environment.

### 2. Scalable and Transformable
HTMLMesh instances can be scaled, rotated, and translated in 3D space, just like any other 3D object. This flexibility lets you place HTML-based controls at specific positions and orientations, enhancing immersion and usability, especially within VR or AR scenes.

### 3. Interactive UI Elements
HTMLMesh can host interactive HTML elements such as buttons, sliders, and input fields, allowing user interaction directly within the 3D environment. This makes HTMLMesh an excellent choice for VR applications that require user interfaces.

### 4. Dynamic Content Updating
Because HTMLMesh renders HTML content, it can be dynamically updated, enabling real-time changes without needing to reload the entire scene. This feature is ideal for displaying real-time data or updating the UI based on user interactions or external inputs.

### 5. Combining CSS with 3D
HTMLMesh content can be styled with CSS, allowing you to create visually appealing interfaces with custom styling. CSS properties (such as padding, border radius, background color, etc.) render as expected, making it easy to align with your app’s design aesthetics.

### 6. Responsive and Lightweight
While HTMLMesh renders as a texture, it responds to DOM changes and updates quickly, keeping performance manageable in most scenes. This balance makes it suitable for WebXR applications that combine 3D elements with traditional web UI.

### 7. Integration with Lil-GUI
HTMLMesh is compatible with GUI libraries like lil-gui, enabling you to render GUI controls as HTML content within HTMLMesh and interact with them in 3D. This compatibility allows for integrating GUI controls within the 3D space, as seen in your example where GUI controls are part of the 3D scene.

---

## Usage Example

Here’s an example of how to create and add an HTMLMesh to a 3D scene:

```javascript
import { HTMLMesh } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

// Initialize lil-gui
const gui = new GUI();
gui.add({ example: "Hello, HTMLMesh!" }, "example");

// Create an HTMLMesh with the GUI element
const guiMesh = new HTMLMesh(gui.domElement);

// Apply transforms to position it in 3D space
guiMesh.scale.setScalar(5);
guiMesh.position.set(0, 1, -3);
guiMesh.rotation.y = Math.PI / 4;

// Add it to the scene
scene.add(guiMesh);
