import {canvas, stats} from "./engine.js";
import {isMobileOrTablet} from "./config.js";

export const uiContainer = document.getElementById('ui-container');
export let loadingButton;
const isMobile = isMobileOrTablet();

if (stats) {
  const body = document.getElementsByTagName('body').item(0);
  body.appendChild(stats.dom);
}
const splashInstructions = document.getElementById('splash-instructions');
const clickToEnterWrapper = document.getElementById('clickToEnter');

if (isMobile) {
  clickToEnterWrapper.addEventListener('click', () => {
    document.getElementById('loadingOverlay').style.display = 'none';
    // <iframe width="100%" height="640" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src="https://kuula.co/share/collection/7K7rz?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1"></iframe>
    const mobileIframe = document.createElement('iframe');
    mobileIframe.src = 'https://kuula.co/share/collection/7K7rz?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1';
    mobileIframe.width = '100%';
    mobileIframe.height = '500px';
    mobileIframe.style.height = '100dvh';
    mobileIframe.frameBorder = '0';
    mobileIframe.allow = 'xr-spatial-tracking; gyroscope; accelerometer';
    mobileIframe.allowFullscreen = true;
    mobileIframe.scrolling = "no";
    document.body.appendChild(mobileIframe);
    console.log(mobileIframe);
  });

  const unsupportedDiv = document.createElement('div');
  unsupportedDiv.innerHTML = 'This experience requires a computer to run. By entering the forest, you will see a <strong>downgraded version</strong> of our virtual experience.';
  unsupportedDiv.className = "mobile-unsupported";
  document.getElementById('clickToEnter').appendChild(unsupportedDiv);
  document.getElementById('loadingPercentage').style.display = 'none';
  document.getElementById('loading-text').style.fontSize = '4.9vw';
} else {
  clickToEnterWrapper.addEventListener('click', () => {
    document.getElementById('loadingOverlay').style.display = 'none';
    splashInstructions.style.display = 'block';
    canvas.style.display = 'block';

    if (!isMobile) {
      document.addEventListener( 'keydown', hideSplashInstructions, {once: true} );
      document.addEventListener( 'keyup', hideSplashInstructions, {once: true} );
    }
  });

  splashInstructions.addEventListener('click', hideSplashInstructions);

  function hideSplashInstructions() {
    splashInstructions.style.display = 'none';
  }

// Create a loading button with an image
  loadingButton = document.createElement('img');
  loadingButton.src = './static/images/loading.png'; // Path to your loading image
  loadingButton.style.width = '100px';
  loadingButton.style.height = '100px';
  loadingButton.style.borderRadius = '50%'; // to make it a circle
  loadingButton.style.transition = 'background-color 0.5s'; // Smooth transition for hover effect
  loadingButton.style.zIndex = '100';
  loadingButton.style.cursor = 'pointer';
  const loadingButtonDiv = document.createElement('div');
  loadingButtonDiv.appendChild(loadingButton);
  clickToEnterWrapper.appendChild(loadingButtonDiv);
}