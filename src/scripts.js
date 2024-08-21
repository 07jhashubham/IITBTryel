import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  HTMLMesh,
  InteractiveGroup,
  OculusHandPointerModel,
} from "three/examples/jsm/Addons.js";
import { OculusHandModel } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

let container;
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster;
const initialTransforms = {};

const intersected = [];
let controls, group, group2, meshBox, meshBox2;
let meshDrag = null;
let m2 = null;
let guiMesh = null;
let group3 = new InteractiveGroup();

let isDragging = false;

let gui = null;
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

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.set(0, 1.6, 3);

  controls = new OrbitControls(camera, container);
  controls.target.set(0, 1.6, 0);
  controls.update();

  const floorGeometry = new THREE.PlaneGeometry(6, 6);
  const floorMaterial = new THREE.ShadowMaterial({
    opacity: 0.25,
    blending: THREE.CustomBlending,
    transparent: false,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 6, 0);
  scene.add(light);

  group = new THREE.Group();
  group2 = new THREE.Group();
  scene.add(group, group2);

  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/jetengine.glb", (model) => {
    model.scene.scale.set(0.2, 0.2, 0.2);
    group2.add(model.scene);
    group2.position.set(0, 1.5, 0);
    m2 = model.scene;
    meshDrag = model.scene.children;

    model.scene.traverse((child) => {
      if (child.isMesh) {
        initialTransforms[child.name] = {
          position: child.position.clone(),
          rotation: child.rotation.clone(),
        };
      }
    });

    // Initialize GUI after model is loaded
    guiInit();
  });

  meshBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshStandardMaterial()
  );
  scene.add(new THREE.AmbientLight("#ffffff", 4));

  meshBox.scale.set(0.2, 0.2, 0.4);
  meshBox.position.set(0.3, 1.3, -3.3);
  meshBox.rotation.y = Math.PI / 2;
  group.add(meshBox);

  meshBox2 = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: "blue" })
  );
  meshBox2.position.set(
    -3.4342483200536908,
    2.643646129672893,
    -0.5578223438313983
  );
  meshBox2.scale.set(0.2, 0.2, 0.4);
  meshBox2.rotation.y = 1.7;
  group.add(meshBox2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  document.body.appendChild(
    XRButton.createButton(renderer, {
      optionalFeatures: ["depth-sensing"],
      depthSensing: {
        usagePreference: ["gpu-optimized"],
        dataFormatPreference: [],
      },
      requiredFeatures: ["hand-tracking"],
    })
  );

  // Controllers
  controller1 = renderer.xr.getController(0);
  controller1.addEventListener("selectstart", onSelectStart1);
  controller1.addEventListener("selectstart", onSelectStart);
  controller1.addEventListener("selectend", onSelectEnd1);
  controller1.addEventListener("selectend", onSelectEnd);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener("selectstart", onSelectStart1);
  controller2.addEventListener("selectstart", onSelectStart);
  controller2.addEventListener("selectend", onSelectEnd1);
  controller2.addEventListener("selectend", onSelectEnd);
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  scene.add(controllerGrip2);

  const hand1 = renderer.xr.getHand(0);
  hand1.add(new OculusHandModel(hand1));
  const handPointer1 = new OculusHandPointerModel(hand1, controllerGrip1);
  hand1.add(handPointer1);
  scene.add(hand1);

  const hand2 = renderer.xr.getHand(1);
  hand2.add(new OculusHandModel(hand2));
  const handPointer2 = new OculusHandPointerModel(hand2, controllerGrip2);
  hand2.add(handPointer2);
  scene.add(hand2);

  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);

  const line = new THREE.Line(geometry);
  line.name = "line";
  line.scale.z = 5;

  controller1.add(line.clone());
  controller2.add(line.clone());

  raycaster = new THREE.Raycaster();

  window.addEventListener("resize", onWindowResize);

  group3.listenToXRControllerEvents(controller1);
  group3.listenToXRControllerEvents(controller2);
  scene.add(group3);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function guiInit() {
  gui = new GUI();

  const partNames = meshDrag.map((part) => part.name); // Get names of all parts
  const modelParts = {
    selectedPart: partNames[0], // Default to the first part
    options: partNames,
  };

  // Create a folder in the GUI
  const partFolder = gui.addFolder("Model Parts");

  // Add buttons for each part inside the folder
  partNames.forEach((partName) => {
    partFolder
      .add({ [partName]: () => selectPart(partName) }, partName)
      .name(partName);
  });

  // Define the function that handles part selection
  function selectPart(selectedName) {
    // Reset emissive color of all parts
    meshDrag.forEach((part) => {
      part.material.emissive.r = 0; // Reset emissive color
    });

    // Find the selected part by name
    const selectedPart = meshDrag.find((part) => part.name === selectedName);

    // Set the emissive color of the selected part
    if (selectedPart) {
      selectedPart.material.emissive.r = 1; // Set emissive color
    }
  }

  // Initialize other GUI elements as needed
  const changeX = gui.add(guiPros, "changeX").min(-10).max(10);
  const reset = gui.add(guiPros, "reset");

  guiMesh = new HTMLMesh(gui.domElement);
  gui.domElement.style.borderRadius = "10px";
  gui.domElement.style.overflow = "hidden";
  gui.domElement.style.paddingBottom = "10px";

  guiMesh.scale.setScalar(5);
  group3.add(guiMesh);
  // group3.rotation.x = 1.5;
  group3.position.set(-1.742483200536908, 2.243646129672893, 1.2);
}

function onSelectStart(event) {
  const controller = event.target;

  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];

    const object = intersection.object;
    if (object === guiMesh) {
      // Trigger interaction with GUI
      gui.domElement.querySelector("select").focus();
    } else {
      object.material.emissive.b = 1;
      controller.attach(object);

      controller.userData.selected = object;
      isDragging = true;
    }
  }

  controller.userData.targetRayMode = event.data.targetRayMode;
}

function onSelectEnd(event) {
  const controller = event.target;

  if (controller.userData.selected !== undefined) {
    const object = controller.userData.selected;
    object.material.emissive.b = 0;
    group2.attach(object);

    controller.userData.selected = undefined;
    isDragging = false;

    // If it's GUI, remove focus
    if (object === guiMesh) {
      gui.domElement.querySelector("select").blur();
    }
  }
}

function onSelectStart1(event) {
  const controller = event.target;

  const intersections = getIntersection(controller);
  if (intersections.length > 0) {
    const intersection = intersections[0];

    const object = intersection.object;
    object.userData.originalParent = object.parent;

    object.material.emissive.b = 1;
    controller.attach(object);

    controller.userData.selected = object;
  }

  controller.userData.targetRayMode = event.data.targetRayMode;
}

function onSelectEnd1(event) {
  const controller = event.target;

  if (controller.userData.selected !== undefined) {
    const object = controller.userData.selected;
    object.material.emissive.b = 0;
    group.attach(object);
    if (object.userData.originalParent) {
      object.userData.originalParent.attach(object);
      delete object.userData.originalParent; // Clean up the stored reference
    }

    controller.userData.selected = undefined;
  }
}

function getIntersections(controller) {
  controller.updateMatrixWorld();
  raycaster.setFromXRController(controller);
  const intersections = raycaster.intersectObjects(group.children, false);

  // Stop propagation once the first intersection is found
  if (intersections.length > 0) {
    return [intersections[0]]; // Return only the first intersection
  }
  return [];
}

const getIntersection = (controller) => {
  controller.updateMatrixWorld();

  const tempMatrix = new THREE.Matrix4()
    .identity()
    .extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  const intersections = raycaster.intersectObjects(meshDrag, false);

  if (intersections.length > 0) {
    return [intersections[0]];
  }
  return [];
};

function animate() {
  meshBox.attach(group2);

  // Compute the world position and quaternion of meshBox2
  const boxWorldPosition = new THREE.Vector3();
  const boxWorldQuaternion = new THREE.Quaternion();

  meshBox2.getWorldPosition(boxWorldPosition);
  meshBox2.getWorldQuaternion(boxWorldQuaternion);

  // Set group3's position and rotation relative to meshBox2's world transform
  group3.position.copy(boxWorldPosition);
  group3.quaternion.copy(boxWorldQuaternion);

  // If needed, you can apply an additional offset or rotation to group3
  // Example of adding a slight offset in the Z direction (forward)
  const offset = new THREE.Vector3(0, 0, 1); // Adjust the offset as needed
  offset.applyQuaternion(boxWorldQuaternion); // Apply the rotation of meshBox2
  group3.position.add(offset);

  renderer.render(scene, camera);
}
