import * as THREE from 'three';
import {loadingButton} from "./dom.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {scene} from "./engine.js";
import {isMobileOrTablet} from "./config.js";

export const objects = [];

if (!isMobileOrTablet()) {
  // Loading manager
  const loadingManager = new THREE.LoadingManager();
  const gltfloader = new GLTFLoader(loadingManager);
  const dracoLoader = new DRACOLoader();

  dracoLoader.setDecoderPath('./static/draco/');
  gltfloader.setDRACOLoader(dracoLoader);

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
    {
      path: './static/models/bird.glb',
      position: [-3.85, 1.19, 1.8],
      rotation: [0, -0.35, 0],
      name: 'Bird',
      description: 'Oil, gold, and silver on wood (Paulownia) 13 3/4 x 10 3/4 in'
    },
    {
      path: './static/models/swamp.glb',
      position: [-3.85, 1.45, 1],
      rotation: [0, 1.5, 0],
      name: 'Swamp',
      description: 'Oil, gold, and silver on wood (Linden) 21 1/2 x 7 1/4 in'
    },
    {
      path: './static/models/rabbit.glb',
      position: [-3.85, 1.15, 0.01],
      rotation: [0, 1.5, 0],
      name: 'Rabbit',
      description: 'Oil, gold, silver, and gold leaf on wood (Paulownia) 18 3/4 x 11 1/2 in'
    },
    {
      path: './static/models/wedding_night.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: 'Wedding Night',
      description: 'Oil, gold, and silver on wood (Curly maple). 18 3/4 x 18 in'
    },
    {
      path: './static/models/anima1.glb',
      position: [-2.04, -0.1, -2.8],
      rotation: [0, -4.6, 0],
      name: 'Anima I',
      description: 'Oil, gold, and silver on wood. 18 x 16 x 18 in'
    },
    {
      path: './static/models/kodama_1.glb',
      position: [1, 0, 0.1],
      rotation: [0, 0.3, 0],
      name: 'Kodama I',
      description: 'Oil, gold, and silver on wood. 14 x 9 in'
    },
    {
      path: './static/models/self_portrait_a.glb',
      position: [2.4, 1.11, -2.27],
      rotation: [0, -1.5, 0],
      name: 'Self Portrait A',
      description: 'Oil, gold, and silver on wood. 17 x 12 in'
    },
    {
      path: './static/models/self_portrait_b.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: 'Self Portrait B',
      description: 'Oil, gold, and silver on wood. 17 x 8 in'
    },
    {
      path: './static/models/anima2.glb',
      position: [-0.25, -0.05, -1.55],
      rotation: [0, -3.85, 0],
      name: 'Anima II',
      description: 'Oil, gold, and silver on wood 18 x 13 x 13 in'
    },
    {
      path: './static/models/revelers.glb',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      name: 'Revelers',
      description: 'Oil, gold, and silver on wood (Lemon tree) 7 5/8 x 7 1/4 in'
    },
    {
      path: './static/models/kodama3.glb',
      position: [2.4, 1.3, -0.55],
      rotation: [0, -1.5, 0],
      name: 'Kodama 3',
      description: 'Oil, gold, and silver on wood. 13 x 16 in'
    },
    {
      path: './static/models/paradise1.glb',
      position: [2.65, 1.05, 3.05],
      rotation: [0, -1.5, 0],
      name: 'Paradise I',
      description: 'Oil, gold, and silver on wood (Black walnut) 32 1/2 x 17 in'
    },
    {
      path: './static/models/paradise2.glb',
      position: [1.55, 0.9, 3.85],
      rotation: [0, 3.15, 0],
      name: 'Paradise II',
      description: 'Oil, gold, and silver on wood (Black walnut) 40 1/4 x 15 3/4 in'
    },
    {
      path: './static/models/deep_sea_fish_a.glb',
      position: [-0.5, 1.4, 3.88],
      rotation: [0, 3.15, 0],
      name: 'Deep-Sea Fish A',
      description: 'Oil and gold on wood (paulownia) 9 1/2 x 14 3/4 in. Abstract painting of a fish'
    },
    {
      path: './static/models/deep_sea_fish_b.glb',
      position: [-0.66, 1.05, 3.88],
      rotation: [0, 3.15, 0],
      name: 'Deep-Sea Fish B',
      description: 'Oil, gold, and silver on wood (paulownia) 9 1/2 x 14 3/4 in. Abstract painting of a fish.'
    },
    {
      path: './static/models/profile.glb',
      position: [-1.98, 1.1, 3.9],
      rotation: [0, 3.15, 0],
      name: 'Profile',
      description: 'Oil, gold, and silver on wood (Japanese cypress. 18 x 9 in.'
    },
    {
      path: './static/models/owl.glb',
      position: [-1.35, 1, 2.75],
      rotation: [0, 2.2, 0],
      name: 'Owl',
      description: 'Oil, gold, and silver on wood (Curly maple). 15 x 8 7/8 in.'
    },
  ];

// Enable shadows for objects
  models.forEach(({path, position, rotation, name, description}) => {
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
            node.userData = {name, description, interactive: true}; // Assign userData to each mesh
          }
        });
        scene.add(object);
        objects.push(object);
        console.debug(`Added object to scene loaded via gltfloader`);
      },
      undefined,
      (error) => {
        console.error(`An error happened while loading ${name}`, error);
      }
    );
  });

  loadingManager.onLoad = function () {
    console.debug('Loading complete!');
    loadingButton.style.border = '5px solid green';
    document.getElementById('down-arrow').style.borderColor = `green`;
    document.getElementById('loadingPercentage').style.color = `green`;
  };

  loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const percentage = Math.min(100, Math.round((itemsLoaded / itemsTotal) * 100));
    document.getElementById('loadingPercentage').innerText = `${percentage}%`;
  };

  loadingManager.onError = function (url) {
    console.warn('There was an error loading ' + url);
  };
}