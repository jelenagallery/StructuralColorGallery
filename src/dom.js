import {canvas, stats} from "./engine.js";

export const uiContainer = document.getElementById('ui-container');
export const body = document.getElementsByTagName('body').item(0);
body.appendChild(stats.dom);

// Create a loading button with an image
export const loadingButton = document.createElement('img');
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
});

document.getElementById('loadingOverlay').appendChild(loadingButtonDiv);
