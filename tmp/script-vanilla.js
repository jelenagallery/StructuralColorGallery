import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Base
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFFFFF');

// Create a loading button with an image
const loadingButton = document.createElement('img');
loadingButton.src = './static/images/loading.png'; // Path to your loading image
loadingButton.style.width = '100px';
loadingButton.style.height = '100px';
loadingButton.style.borderRadius = '50%'; // to make it a circle
loadingButton.style.transition = 'background-color 0.5s'; // Smooth transition for hover effect
loadingButton.style.zIndex = '100';
loadingButton.style.cursor = 'pointer';
const loadingButtonDiv = document.createElement('div');
loadingButtonDiv.appendChild(loadingButton);
document.body.appendChild(loadingButtonDiv);

loadingButton.addEventListener('click', () => {
    document.getElementById('loadingOverlay').style.display = 'none';
    canvas.style.display = 'block';
    window.addEventListener('mousemove', onObjectHover);
    document.addEventListener('mousemove', onMouseMove);
});

document.getElementById('loadingOverlay').appendChild(loadingButtonDiv);

// Loading manager
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

loadingManager.onLoad = function () {
    console.log('Loading complete!');
    loadingButton.style.border = '5px solid green';
    document.getElementById('down-arrow').style.borderColor = `green`;
    document.getElementById('loadingPercentage').style.color = `green`;
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const percentage = Math.round((itemsLoaded / itemsTotal) * 100);
    document.getElementById('loadingPercentage').innerText = `${percentage}%`;
};

loadingManager.onError = function (url) {
    console.log('There was an error loading ' + url);
};

// GLTF Loader with DRACO Loader
const gltfloader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('./static/draco/');
gltfloader.setDRACOLoader(dracoLoader);

let selectedObject = null;
let originalObjectPosition = new THREE.Vector3();

gltfloader.load(
    './static/models/forest.glb',
    (gltf) => {
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.rotation.set(0, 0, 0);
        // Set non-interactive flag
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                node.userData.interactive = false; // Mark as non-interactive
            }
        });
        scene.add(gltf.scene);
    }
);

// Models array with positions, names, and descriptions
const models = [
    { path: './static/models/bird.glb', position: [-3.85, 1.19, 1.8], rotation: [0, -0.35, 0], name: 'Bird', description: 'Oil, gold, and silver on wood (Paulownia) 13 3/4 x 10 3/4 in' },
    { path: './static/models/swamp.glb', position: [-3.85, 1.45, 1], rotation: [0, 1.5, 0], name: 'Swamp', description: 'Oil, gold, and silver on wood (Linden) 21 1/2 x 7 1/4 in' },
    { path: './static/models/rabbit.glb', position: [-3.85, 1.15, 0.01], rotation: [0, 1.5, 0], name: 'Rabbit', description: 'Oil, gold, silver, and gold leaf on wood (Paulownia) 18 3/4 x 11 1/2 in'},
    { path: './static/models/wedding_night.glb', position: [0, 0, 0], rotation: [0, 0, 0], name: 'Wedding Night', description: 'Oil, gold, and silver on wood (Curly maple). 18 3/4 x 18 in'},
    { path: './static/models/anima1.glb', position: [-2.04, -0.1, -2.8], rotation: [0, -4.6, 0], name: 'Anima I', description: 'Oil, gold, and silver on wood. 18 x 16 x 18 in' },
    { path: './static/models/kodama_1.glb', position: [1, 0, 0.1], rotation: [0, 0.3, 0], name: 'Kodama I', description: 'Oil, gold, and silver on wood. 14 x 9 in' },
    { path: './static/models/self_portrait_a.glb', position: [2.4, 1.11, -2.27], rotation: [0, -1.5, 0], name: 'Self Portrait A', description: 'Oil, gold, and silver on wood. 17 x 12 in' },
    { path: './static/models/self_portrait_b.glb', position: [0, 0, 0], rotation: [0, 0, 0], name: 'Self Portrait B', description: 'Oil, gold, and silver on wood. 17 x 8 in' },
    { path: './static/models/anima2.glb', position: [-0.25, -0.05, -1.55], rotation: [0, -3.85, 0], name: 'Anima II', description: 'Oil, gold, and silver on wood 18 x 13 x 13 in' },
    { path: './static/models/revelers.glb', position: [0, 0, 0], rotation: [0, 0, 0], name: 'Revelers', description: 'Oil, gold, and silver on wood (Lemon tree) 7 5/8 x 7 1/4 in' },
    { path: './static/models/kodama3.glb', position: [2.4, 1.3, -0.55], rotation: [0, -1.5, 0], name: 'Kodama 3', description: 'Oil, gold, and silver on wood. 13 x 16 in' },
    { path: './static/models/paradise1.glb', position: [2.65, 1.05, 3.05], rotation: [0, -1.5, 0], name: 'Paradise I', description: 'Oil, gold, and silver on wood (Black walnut) 32 1/2 x 17 in'},
    { path: './static/models/paradise2.glb', position: [1.55, 0.9, 3.85], rotation: [0, 3.15, 0], name: 'Paradise II', description: 'Oil, gold, and silver on wood (Black walnut) 40 1/4 x 15 3/4 in'},
    { path: './static/models/deep_sea_fish_a.glb', position: [-0.5, 1.4, 3.88], rotation: [0, 3.15, 0], name: 'Deep-Sea Fish A', description: 'Oil and gold on wood (paulownia) 9 1/2 x 14 3/4 in. Abstract painting of a fish' },
    { path: './static/models/deep_sea_fish_b.glb', position: [-0.66, 1.05, 3.88], rotation: [0, 3.15, 0], name: 'Deep-Sea Fish B', description: 'Oil, gold, and silver on wood (paulownia) 9 1/2 x 14 3/4 in. Abstract painting of a fish.' },
    { path: './static/models/profile.glb', position: [-1.98, 1.1, 3.9], rotation: [0, 3.15, 0], name: 'Profile', description: 'Oil, gold, and silver on wood (Japanese cypress. 18 x 9 in.' },
    { path: './static/models/owl.glb', position: [-1.35, 1, 2.75], rotation: [0, 2.2, 0], name: 'Owl', description: 'Oil, gold, and silver on wood (Curly maple). 15 x 8 7/8 in.' },
];

// Enable shadows for objects
models.forEach(({ path, position, rotation, name, description }) => {
    gltfloader.load(
        path,
        (gltf) => {
            const object = gltf.scene.children[0]; // Assuming the first child is the main object

            object.position.set(...position);
            object.rotation.set(...rotation);
            object.scale.set(1, 1, 1);
            object.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = false;  // Disabled casting shadows for performance gain
                    node.receiveShadow = false;  // Disabled receiving shadows for performance gain
                    node.userData = { name, description, interactive: true }; // Assign userData to each mesh
                }
            });
            scene.add(object);
        },
        undefined,
        (error) => {
            console.error(`An error happened while loading ${name}`, error);
        }
    );
});

function addAmbientLight(intensity, color) {
    const ambientLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambientLight);
}
addAmbientLight(1.5, 0xffffff);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4.6, 1.5, 1.6);
camera.rotation.set(0, 1.5, 0);

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Movement variables
const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

// Bounding box
const boundingBox = new THREE.Box3(
    new THREE.Vector3(-3.35, 0, -3.5),
    new THREE.Vector3(5, 5, 4.05)
);

let rotateEnabled = false;

// Event listeners for keydown and keyup
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            movement.forward = true;
            rotateEnabled = true;
            break;
        case 'KeyS':
            movement.backward = true;
            rotateEnabled = true;
            break;
        case 'KeyA':
            movement.left = true;
            rotateEnabled = true;
            break;
        case 'KeyD':
            movement.right = true;
            rotateEnabled = true;
            break;
        case 'KeyR':
            recenterCamera();
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            movement.forward = false;
            rotateEnabled = movement.backward || movement.left || movement.right;
            break;
        case 'KeyS':
            movement.backward = false;
            rotateEnabled = movement.forward || movement.left || movement.right;
            break;
        case 'KeyA':
            movement.left = false;
            rotateEnabled = movement.forward || movement.backward || movement.right;
            break;
        case 'KeyD':
            movement.right = false;
            rotateEnabled = movement.forward || movement.backward || movement.left;
            break;
    }
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// UI Container
const uiContainer = document.getElementById('ui-container');

// Outline material for highlighting
const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

// Function to show the UI panel
const showUIPanel = (name, description) => {
    const uiElement = document.createElement('div');
    uiElement.style.display = 'inline-block';
    uiElement.style.content = '';
    uiElement.style.content = 'justify';
    uiElement.style.width = '100%';
    uiElement.style.verticalAlign = 'top';
    uiElement.className = 'ui-element show';
    uiElement.style.width = '20vw';
    uiElement.style.height = '10vh';
    uiElement.style.fontSize = '18px';
    uiElement.style.letterSpacing = '0.5px';

    uiElement.innerHTML = `
        <div><strong>${name}</strong></div>
        <div>${description}</div>
        <button class="exit-button">Exit</button>
    `;
    uiContainer.innerHTML = '';
    uiContainer.appendChild(uiElement);

    const exitButton = uiElement.querySelector('.exit-button');
    exitButton.style.backgroundColor = '#A95E2A'; // Set the background color
    exitButton.style.color = '#ffffff'; // Set the text color to white for better contrast
    exitButton.style.border = '0px solid #A95E2A'; // Set the border width and color
    exitButton.style.borderRadius = '2px'; // Optional: add rounded corners
    exitButton.style.transform = 'scale(1)';
    exitButton.style.marginTop = '10px';
    exitButton.style.marginLeft = '2px';

    updateUIElementPosition(selectedObject);

    // Exit button event listener
    uiElement.querySelector('.exit-button').addEventListener('click', () => {
        exitCameraLookAt();
    });
};

// Function to hide the UI panel
const hideUIPanel = () => {
    uiContainer.innerHTML = '';
};

// Function to update the position of the UI element
const updateUIElementPosition = (object) => {
    if (object) {
        const objectPosition = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
        const screenPosition = objectPosition.project(camera);

        const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = (screenPosition.y * -0.5 + 0.5) * window.innerHeight;

        const uiElement = document.querySelector('.ui-element');
        if (uiElement) {
            uiElement.style.transform = `translate(-75%, -75%) translate(${x}px,${y}px)`;
        }
    }
};

// Update to show UI panel with information about the object on hover
const onObjectHover = (event) => {
    event.preventDefault();

    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const firstIntersectedObject = intersects[0].object;

        if (firstIntersectedObject.userData.interactive !== false) {
            if (selectedObject !== firstIntersectedObject) {
                if (selectedObject) {
                    selectedObject.material = selectedObject.originalMaterial;
                }

                selectedObject = firstIntersectedObject;
                selectedObject.originalMaterial = selectedObject.material;
                // selectedObject.material = outlineMaterial;

                const { name, description } = selectedObject.userData; // Access userData directly from the intersected mesh
                showUIPanel(name, description);
            }
        }
    } else if (selectedObject) {
        selectedObject.material = selectedObject.originalMaterial;
        selectedObject = null;
        hideUIPanel();
    }
};

// Function to exit the camera look at and restore the original state
const exitCameraLookAt = () => {
    if (selectedObject) {
        selectedObject.material = selectedObject.originalMaterial;
    }
    selectedObject = null;
    hideUIPanel();
};

// Function to recenter the camera
function recenterCamera() {
    camera.position.set(4.6, 1.5, 1.6);
    camera.rotation.set(0, 1.5, 0);
}

let targetLookAt = new THREE.Vector3();
const lookAtSmoothFactor = 0.02; // Lower value for smoother movement

// Speed factor for camera movement
const moveSpeed = 0.01; // You can adjust this value for different speeds

// Function to handle mouse movement and update the target lookAt position
const onMouseMove = (event) => {
    if (rotateEnabled) {
        const mouseX = (event.clientX / window.innerWidth - 0.5) * 0.2; // Reduce sensitivity
        const mouseY = 0; // Lock vertical rotation by setting mouseY to 0

        const vector = new THREE.Vector3(mouseX, mouseY, 0.5).unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        targetLookAt = camera.position.clone().add(dir.multiplyScalar(distance));
    }
};

// Animation loop
const tick = () => {
    // Update camera lookAt position smoothly
    camera.lookAt(
        THREE.MathUtils.lerp(camera.position.x, targetLookAt.x, lookAtSmoothFactor),
        camera.position.y, // Lock vertical rotation
        THREE.MathUtils.lerp(camera.position.z, targetLookAt.z, lookAtSmoothFactor)
    );

    // Update camera position based on movement
    if (movement.forward) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        camera.position.add(direction.multiplyScalar(moveSpeed)); // Move forward
    }
    if (movement.backward) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        camera.position.add(direction.multiplyScalar(-moveSpeed)); // Move backward
    }
    if (movement.left) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.cross(camera.up); // Get the perpendicular direction
        camera.position.add(direction.multiplyScalar(-moveSpeed)); // Move left
    }
    if (movement.right) {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.cross(camera.up); // Get the perpendicular direction
        camera.position.add(direction.multiplyScalar(moveSpeed)); // Move right
    }

    // Clamp camera position within bounding box
    const position = camera.position;
    position.x = Math.min(Math.max(position.x, boundingBox.min.x), boundingBox.max.x);
    position.y = Math.min(Math.max(position.y, boundingBox.min.y), boundingBox.max.y);
    position.z = Math.min(Math.max(position.z, boundingBox.min.z), boundingBox.max.z);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();

// Handle mouse movements for UI hover
window.addEventListener('mousemove', onObjectHover);

// Add skybox
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTextures = [
    './static/textures/skybox/right.jpg',
    './static/textures/skybox/left.jpg',
    './static/textures/skybox/top.jpg',
    './static/textures/skybox/bottom.jpg',
    './static/textures/skybox/front.jpg',
    './static/textures/skybox/back.jpg'
];
const skybox = skyboxLoader.load(skyboxTextures);
scene.background = skybox;
