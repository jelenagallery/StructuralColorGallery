// Update to show UI panel with information about the object on hover
import * as THREE from "three";
import {camera, canvas, scene} from "./engine.js";
import {sizes} from "./config.js";
import {uiContainer} from "./dom.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
export let selectedObject = null;

export const onObjectHover = (event) => {
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
export const exitCameraLookAt = () => {
  if (selectedObject) {
    selectedObject.material = selectedObject.originalMaterial;
  }
  selectedObject = null;
  hideUIPanel();
};

// Function to show the UI panel
export const showUIPanel = (name, description) => {
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
        <button class="exit-button">Close</button>
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
export const hideUIPanel = () => {
  uiContainer.innerHTML = '';
};

const updateUIElementPosition = (object) => {
  if (object) {
    const widthHalf = 0.5 * canvas.offsetWidth;
    const heightHalf = 0.5 * canvas.offsetHeight;
    object.updateMatrixWorld();
    const objectPosition = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
    const screenPosition = objectPosition.project(camera);

    const x = (screenPosition.x * widthHalf) + widthHalf;
    const y = -(screenPosition.y * heightHalf) + heightHalf;

    const uiElement = document.querySelector('.ui-element');
    if (uiElement) {
      // uiElement.style.transform = `translate(-75%, -75%) translate(${x}px,${y}px)`;
      uiElement.style.position = 'absolute';
      uiElement.style.left = `${x}px`;
      uiElement.style.top = `${y}px`;
    }
  }
};
