import * as THREE from 'three';
import {isMobileOrTablet, isSafari, params, sizes, skyboxTextures, STATS_ENABLED} from "./config.js";
import Stats from "three/addons/libs/stats.module.js";
import {init as initControls} from "./controls.js";

export let canvas;
export let scene;
export let camera;
export let renderer;
export let stats;

if (!isMobileOrTablet()) {
  // Base
  const requestedFps = params().get('fps') ?? null;
  canvas = document.querySelector('canvas.webgl');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  if (STATS_ENABLED) {
    stats = new Stats();
  }

  const onLock = () => onResize(true);
  const onUnlock = () => onResize(false);

  renderer.domElement.ownerDocument.addEventListener('pointerlockchange', () => onResize('pointerlockchange'));

  const onResize = (isLocked = null) => {
    const isSafariBrowser = isSafari();
    if (isSafariBrowser) {
      if (isLocked === true) {
        canvas.style.top = '-30px';
      } else if (isLocked === false) {
        canvas.style.top = '0px';
      }
    } else {
      if (sizes.coverPage) {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
      }

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }
  };

  const {animateControls, enableKeyboard} = initControls(camera, renderer, scene, onLock, onUnlock);
  const ambientLight = new THREE.AmbientLight(0xffffff, 4);
  let initialized = false;

  scene.background = new THREE.Color('#FFFFFF');
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor( 0x000000, 0.0 );
  camera.rotation.set(0, 1.5, 0);
  camera.position.set(4.5, 1.5, 1.6);
  scene.add(camera);
  scene.add(ambientLight);

  enableKeyboard();

  // Add skybox
  const skyboxLoader = new THREE.CubeTextureLoader();
  scene.background = skyboxLoader.load(skyboxTextures);

  // Animation loop
  const tick = () => {
    animateControls();
    renderer.render(scene, camera);
    if (stats) {
      stats.update();
    }

    if (!initialized) {
      initialized = true;
      canvas.toDataURL();
    }
  };

  const runPlain = () => {
    tick(); // first tick to load the scene fully once load progress is at 100%
    renderer.setAnimationLoop(tick);
  };

  const runManaged = () => {
    let frameLengthMS = 1000 / (requestedFps ? requestedFps : 60); // 60 fps
    let previousTime = 0;

    console.debug('Running managed:', {requestedFps});

    function render(timestamp) {
      if (!timestamp || timestamp - previousTime > frameLengthMS) {
        tick();
        previousTime = timestamp;
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };

  if (requestedFps) {
    runManaged();
  } else {
    runPlain();
  }

  window.addEventListener('resize', onResize);
}
