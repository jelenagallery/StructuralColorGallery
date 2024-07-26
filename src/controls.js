import {PointerLockControls} from "three/addons";
import * as THREE from "three";
import {objects} from "./load.js";
import {onObjectHover} from "./labels.js";

export function init (camera, renderer, scene) {
  const controls = new PointerLockControls( camera, renderer.domElement );
  const raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
  const deltaMul = 1000;
  const wasd1 = 10.0;
  const wasd2 = 9.8;
  const wasd3 = 20.0;
  const wasd4 = 60.0;
  // cornerDoorSide: x = door wall
  const cornerDoorSideOutside = new THREE.Vector3(4.5, 3.5, 3.5);
  const cornerDoorSideInside = new THREE.Vector3(2.0, 3.5, 3.5);
  // cornerOppositeOfDoorSide: x = infinite space wall with trees
  const cornerOppositeOfDoorSide = new THREE.Vector3(-3.5, 0, -2.5);
  let boundingBox = new THREE.Box3(
    cornerOppositeOfDoorSide,
    cornerDoorSideOutside,
  );

  controls.unlock();
  scene.add(controls.getObject());

  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  let canJump = false;

  let prevTime = performance.now();
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  const lockMouse = () => {
    return controls.lock();
  };
  const unlockMouse = function () {
    return controls.unlock();
  };
  renderer.domElement.addEventListener('mousedown', lockMouse);
  renderer.domElement.addEventListener('mouseup', unlockMouse);
  renderer.domElement.addEventListener('mousemove', onObjectHover);

  const enableKeyboard = () => {
    const onKeyDown = function ( event ) {
      switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = true;
          break;
        case 'Space':
          if ( canJump === true ) velocity.y += 350;
          canJump = false;
          break;
      }
    };

    const onKeyUp = function ( event ) {
      switch ( event.code ) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight = false;
          break;
      }
    };

    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
  }

  const animateControls = () => {
    const time = performance.now();
    // const clock = new THREE.Clock();
    // controls.update && controls.update(clock.getDelta());

    // if ( controls.isLocked === true ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;

      const intersections = raycaster.intersectObjects( objects, false );
      const onObject = intersections.length > 0;
      const delta = ( time - prevTime ) / deltaMul;

      velocity.x -= velocity.x * wasd1 * delta;
      velocity.z -= velocity.z * wasd1 * delta;

      velocity.y -= wasd2 * wasd3 * delta; // 100.0 = mass

      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) velocity.z -= direction.z * wasd3 * delta;
      if ( moveLeft || moveRight ) velocity.x -= direction.x * wasd4 * delta;

      if ( onObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
      }

      controls.moveRight( - velocity.x * delta );
      controls.moveForward( - velocity.z * delta );
      controls.moveForward( - velocity.z * delta );

      // clamp camera. but should be done via controls.
      const position = camera.position;
      position.x = Math.min(Math.max(position.x, boundingBox.min.x), boundingBox.max.x);
      position.y = Math.min(Math.max(position.y, boundingBox.min.y), boundingBox.max.y);
      position.z = Math.min(Math.max(position.z, boundingBox.min.z), boundingBox.max.z);

      if (position.x < cornerDoorSideInside.x) {
        boundingBox = new THREE.Box3(
          cornerOppositeOfDoorSide,
          cornerDoorSideInside,
        );
      }
    // }

    prevTime = time;
  }
  return {controls, animateControls, enableKeyboard};
}