import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {sizes, skyboxTextures} from "./config.js";
// import Stats from "three/addons/libs/stats.module.js";
import {init as initControls} from "./controls.js";

// Base
export const canvas = document.querySelector('canvas.webgl');
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
  preserveDrawingBuffer: true,
});
export const {animateControls, enableKeyboard} = initControls(camera, renderer, scene);
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
const skybox = skyboxLoader.load(skyboxTextures);
scene.background = skybox;

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

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


tick(); // first tick to load the scene fully once load progress is at 100%
initControls(camera, renderer, scene);
renderer.setAnimationLoop(tick);
