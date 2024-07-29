import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {isMobileOrTablet, isSafari, sizes, skyboxTextures} from "./config.js";
// import Stats from "three/addons/libs/stats.module.js";
import {init as initControls} from "./controls.js";

export let canvas;
export let scene;
export let camera;
export let renderer;

if (!isMobileOrTablet()) {
// Base
  canvas = document.querySelector('canvas.webgl');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });

  const onLock = () => onResize(true);
  const onUnlock = () => onResize(false);

  renderer.domElement.ownerDocument.addEventListener('pointerlockchange', () => onResize('pointerlockchange'));

  const onResize = (isLocked = null) => {
    const isSafariBrowser = isSafari();
    if (isSafariBrowser) {
      if (isLocked === true) {
        canvas.style.top = '-30px';
        // canvas.style.marginTop = '-30px';
      } else if (isLocked === false) {
        canvas.style.top = '0px';
        // canvas.style.marginTop = '0px';
      }
    } else {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }
  };

  const {animateControls, enableKeyboard} = initControls(camera, renderer, scene, onLock, onUnlock);
  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
// export const stats = new Stats();
  let initialized = false;

  scene.background = new THREE.Color('#FFFFFF');
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
// camera.position.set(4.6, 1.5, 1.6);
// camera.rotation.set(0, 1.5, 0);
  camera.rotation.set(0, 1.5, 0);
  camera.position.set(4.5, 1.5, 1.6);
// camera.lookAt( 1,1,1 );

  scene.add(camera);
  scene.add(ambientLight);

  enableKeyboard();

// Add skybox
  const skyboxLoader = new THREE.CubeTextureLoader();
  scene.background = skyboxLoader.load(skyboxTextures);

// // Animation loop
  const tick = () => {
    animateControls();
    TWEEN.update();
    renderer.render(scene, camera);
    // stats.update();

    if (!initialized) {
      initialized = true;
      canvas.toDataURL();
    }
  };

  window.addEventListener('resize', onResize);
  tick(); // first tick to load the scene fully once load progress is at 100%
  renderer.setAnimationLoop(tick);
}
