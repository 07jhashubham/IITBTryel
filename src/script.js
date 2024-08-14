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
    // Reset group2 (jet engine model) position
    group2.position.set(0, 1.5, 0);
    if (m2) m2.rotation.set(0, 0, 0);

    // Reset meshBox position and rotation
    meshBox.position.set(0.3, 1.3, -3.3);
    meshBox.rotation.set(0, Math.PI / 2, 0);

    // Reset meshBox2 position and rotation
    meshBox2.position.set(
      -5.4342483200536908,
      1.643646129672893,
      -0.5578223438313983
    );
    meshBox2.rotation.set(0, 2.7, 0);

    // Reset group3 (GUI group) position and rotation
    group3.position.set(-1.742483200536908, 2.243646129672893, 1.2);
    group3.rotation.set(0, 1.5, 0);

    // Remove the existing GUI mesh
    group3.remove(guiMesh);

    // Force redraw the GUI
    gui.domElement.style.display = "none";
    setTimeout(() => {
      gui.domElement.style.display = "block";
    }, 0);

    // Recreate and reattach the HTMLMesh
    guiMesh = new HTMLMesh(gui.domElement);
    guiMesh.scale.setScalar(5);
    group3.add(guiMesh);
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
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: "blue" })
  );
  meshBox2.position.set(
    -5.4342483200536908,
    1.643646129672893,
    -0.5578223438313983
  );
  meshBox2.scale.set(0.2, 0.2, 0.4);
  meshBox2.rotation.y = 2.7;
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

  // Initialize GUI
  guiIint();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

group3.listenToXRControllerEvents(controller1);
group3.listenToXRControllerEvents(controller2);
scene.add(group3);

function guiIint() {
  gui = new GUI();

  const cahangeX = gui.add(guiPros, "changeX").min(-10).max(10);
  const reset = gui.add(guiPros, "reset");

  guiMesh = new HTMLMesh(gui.domElement);
  gui.domElement.style.borderRadius = "10px";
  gui.domElement.style.overflow = "hidden";
  gui.domElement.style.paddingBottom = "10px";

  guiMesh.scale.setScalar(5);
  group3.add(guiMesh);
  group3.rotation.y = 1.5;
  group3.position.set(-1.742483200536908, 2.243646129672893, 1.2);
}

function onSelectStart(event) {
  const controller = event.target;

  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];

    const object = intersection.object;
    object.material.emissive.b = 1;
    controller.attach(object);

    controller.userData.selected = object;
    isDragging = true;
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
  }
}
function onSelectStart1(event) {
  const controller = event.target;

  const intersections = getIntersection(controller);
  // console.log(intersections);

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

// console.log(group.position);

const getIntersection = (controller) => {
  controller.updateMatrixWorld();

  const tempMatrix = new THREE.Matrix4()
    .identity()
    .extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  const intersections = raycaster.intersectObjects(meshDrag, false);

  if (intersections.length > 0) {
    console.log(intersections[0]);
    return [intersections[0]];
  }
  return [];
};

function intersectObjects(controller) {
  if (controller.userData.targetRayMode === "screen") return;
  if (controller.userData.selected !== undefined) return;

  const line = controller.getObjectByName("line");
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const object = intersection.object;
    object.material.emissive.r = 1;
    intersected.push(object);

    line.scale.z = intersection.distance;
  } else {
    line.scale.z = 5;
  }
}

function cleanIntersected() {
  while (intersected.length) {
    const object = intersected.pop();
    object.material.emissive.r = 0;
  }
}

function animate() {
  meshBox.attach(group2);

  meshBox2.add(group3);

  renderer.render(scene, camera);
}
