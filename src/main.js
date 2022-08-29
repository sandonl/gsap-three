import "./style.css";
import * as THREE from "three";
// import * as dat from "lil-gui";

// Import Model
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import modelURL from "/models/model.gltf?url";

// GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

// Gsap
gsap.registerPlugin(ScrollTrigger);

/**
 * Base
 */
// Debug;
// const gui = new dat.GUI({ width: 340 });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/gltf/");
const gltfLoader = new GLTFLoader();

let model = null;
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(modelURL, (gltf) => {
  model = gltf.scene;
  scene.add(model);
});

// Axes helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

/**
 * Particles
 */

// Geometry
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = Math.random() * 1 * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: "#ffffff",
  sizeAttenuation: true,
  size: 0.03,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  0.9,
  1000
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(0, 4, 0);
scene.add(pointLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// GSAP
scene.rotation.set(0, 1.88, 0);
camera.position.set(2, 1.4, 5);
const origin = new THREE.Vector3(0, 1.4, 0);

let car_anim = gsap.timeline();

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
});

// Slide 2
car_anim.to(camera.position, {
  x: 0,
  scrollTrigger: {
    trigger: ".section-two",

    start: "top bottom",
    end: "top top",
  },
});

// Slide 3
car_anim.to(camera.position, {
  x: 3,
  z: 4,
  scrollTrigger: {
    trigger: ".section-three",

    start: "top bottom",
    end: "top top",
    onUpdate: () => {
      camera.lookAt(origin);
    },
  },
});

// // Slide 4
car_anim.to(camera.position, {
  z: -5,
  y: 3.1,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top bottom",
    end: "top top",
    onUpdate: () => {
      camera.lookAt(origin);
    },
  },
});

car_anim.to(camera.position, {
  x: 1,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top top",
    end: "bottom top",
  },
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   Animate particles
  particles.rotation.x = elapsedTime * 0.05;

  // Update controls
  // controls.update();

  // if (model !== null) {
  //   model.rotation.y += 0.01;
  // }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
