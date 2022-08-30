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

// Rainbow Coloured Text
// Designed by Julian Parker https://codepen.io/hooliop/pen/QWOjJPw
const RAINBOW_COLORS = ["#a32d42", "#f14666", "#ec958e", "#f5a46b", "#ffcdaa"];
const RAINBOW_CHUNK_LENGTH = 6;
const SHADOW_LENGTH = RAINBOW_CHUNK_LENGTH * RAINBOW_COLORS.length;

const headingElement = document.querySelector("h1");
let textShadow = "";

const WINDOW_WIDTH = window.innerWidth;
const WIDTH_MIDPOINT = WINDOW_WIDTH / 2;
const WINDOW_HEIGHT = window.innerHeight;
const HEIGHT_MIDPOINT = WINDOW_HEIGHT / 2;
const MIDPOINT_BUFFER = 100;
let polarity = {
  x: "+",
  y: "+",
};
let poleX, poleY;

document.addEventListener("mousemove", (e) => {
  if (
    e.clientX > WIDTH_MIDPOINT - MIDPOINT_BUFFER &&
    e.clientX < WIDTH_MIDPOINT + MIDPOINT_BUFFER
  ) {
    poleX = ".";
  } else if (e.clientX < WIDTH_MIDPOINT) {
    poleX = "-";
  } else {
    poleX = "+";
  }

  if (
    e.clientY > HEIGHT_MIDPOINT - MIDPOINT_BUFFER &&
    e.clientY < HEIGHT_MIDPOINT + MIDPOINT_BUFFER
  ) {
    poleY = ".";
  } else if (e.clientY < HEIGHT_MIDPOINT) {
    poleY = "-";
  } else {
    poleY = "+";
  }

  if (poleX !== polarity.x || poleY !== polarity.y) {
    updatePolarity(poleX, poleY);
    updateTextShadow();
  }
});

const updatePolarity = (x, y) => {
  polarity.x = x;
  polarity.y = y;
};

const resetTextShadow = () => {
  textShadow = "0 0 transparent";
};

const updateTextShadow = () => {
  resetTextShadow();
  for (let i = 1; i <= SHADOW_LENGTH; i++) {
    let chunkColor = RAINBOW_COLORS[Math.floor((i - 1) / RAINBOW_CHUNK_LENGTH)];
    let chunkPos = polarity.x === "." ? 0 : i;
    textShadow += ` ,
          ${polarity.x}${chunkPos}px
          ${polarity.y}${i}px
          1px
          ${chunkColor}
         `;
    if (i % RAINBOW_CHUNK_LENGTH === 0 && i !== RAINBOW_CHUNK_LENGTH) {
      textShadow += ` ,
          ${polarity.x}${chunkPos}px
          ${polarity.y}${i}px
          1px
          ${RAINBOW_COLORS[0]}
         `;
    }
  }
  headingElement.style.textShadow = textShadow;
};

updateTextShadow();

// Gsap
gsap.registerPlugin(ScrollTrigger);

// Initial hero animation
gsap.from(".hero", { duration: 1.0, x: "100%", ease: "Back.easeOut" });

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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3);
pointLight.position.set(-1.5, 3.5, 2.5);
scene.add(pointLight);

// gui
//   .add(pointLight.position, "x")
//   .min(-10)
//   .max(10)
//   .step(0.5)
//   .name("pointLightPosX");
// gui
//   .add(pointLight.position, "y")
//   .min(-10)
//   .max(10)
//   .step(0.5)
//   .name("pointLightPosY");
// gui
//   .add(pointLight.position, "z")
//   .min(-10)
//   .max(10)
//   .step(0.5)
//   .name("pointLightPosZ");

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

/**
 * All GSAP Animations
 */
scene.rotation.set(0, 1.88, 0);
camera.position.set(2, 1.4, 5);
const origin = new THREE.Vector3(0, 1.4, 0);

let head_anim = gsap.timeline();

ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
});

// Animate slide 2 model
head_anim.to(camera.position, {
  x: 0,
  scrollTrigger: {
    trigger: ".section-two",

    start: "top bottom",
    end: "top top",
  },
});

// Animate incoming section 2
gsap.to(".section-two", {
  scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "end end",
  },
  backgroundColor: "#f14666",
  ease: "none",
});

gsap.from(".text-wrap-two", {
  duration: 1.3,
  x: "-100%",
  ease: "slow",
  scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "end end",
  },
});

// Animate incoming section 3
gsap.to(".section-three", {
  scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "end end",
  },
  backgroundColor: "#ec958e",
  ease: "none",
});

gsap.from(".text-wrap-three", {
  duration: 1.3,
  x: "100%",
  ease: "slow",
  scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "end end",
  },
});

// Animate slide 3 model
head_anim.to(camera.position, {
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

// Animate incoming section 4
gsap.to(".section-four", {
  scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",
    end: "end end",
  },
  backgroundColor: "#ffcdaa",
  ease: "none",
});

gsap.from(".text-wrap-four", {
  duration: 1.3,
  y: "100%",
  ease: "slow",
  scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",
    end: "end end",
  },
});

// Animate slide 4 model
head_anim.to(camera.position, {
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

head_anim.to(camera.position, {
  x: 1,
  scrollTrigger: {
    trigger: ".section-four",

    start: "top top",
    end: "bottom top",
  },
});

// Animate incoming section 5
gsap.to(".section-five", {
  scrollTrigger: {
    trigger: ".section-five",
    start: "top bottom",
    end: "end end",
  },
  backgroundColor: "#9cb898",
  ease: "none",
});

gsap.from(".cta-button", {
  // duration: 3,
  x: "200%",
  ease: "Back.easeOut.config(1.7)",
  scrollTrigger: ".section-five",
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   Animate particles
  particles.rotation.x = elapsedTime * 0.05;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
