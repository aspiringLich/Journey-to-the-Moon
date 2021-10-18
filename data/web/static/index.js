const waits = { ".": 300, ":": 500, "\n": 1000 };
let init3DStuff = false;
let running = false;
let speedy = false;
let downKeys = {};

const printTextDone = new Event('printTextDone');

// Make start button... start the game
document.querySelector("#start").addEventListener("click", startGame);

// Kaybord Sound Stuff
window.addEventListener("keydown", (e) => {
  if (downKeys[e.key]) return;
  downKeys[e.key] = true;
  new Audio("assets/keyPress.mp3").play();
});
window.addEventListener("keyup", (e) => (downKeys[e.key] = false));

// Speedup and Reset keyboard stuff
window.addEventListener("keydown", (e) => {
  if (e.key === "r") {
    running = false;
    document.querySelector("#start").style.opacity = "1";
    document.querySelector("#wrap").style.filter = "blur(5px)";
    document.querySelector("#console").innerHTML = "";
  }
  if (e.key !== " ") return;
  if (!running) startGame();
  speedy = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === " ") speedy = false;
});

window.addEventListener('printTextDone', () => {
  console.log("DONE!");
});

// For drawing to the console
function updateScreenChar(text, index, toSpace) {
  keysRuning = true;
  index++;
  if (!running) return;
  if (index >= text.length) {
    window.dispatchEvent(printTextDone);
    return;
  }

  let delay = 50;
  if (Object.keys(waits).includes(text[index])) delay = waits[text[index]];
  if (speedy) delay /= 2;

  new Audio("assets/blip2.mp3").play();

  if (text[index] === " ") {
    setTimeout(() => updateScreenChar(text, index, true), delay);
    return;
  }

  let s = "";
  if (toSpace) s = " ";
  let cons = document.querySelector("#console");
  cons.innerHTML = `${cons.innerHTML.slice(
    0,
    cons.innerHTML.length - 28
  )}${s}${text[index].replace("\n", "<br>")}<span class="blink">█</span>`;

  setTimeout(() => updateScreenChar(text, index, false), delay);
}

// Start the game
// ... if the name wasent clear
function startGame() {
  running = true;
  if (!init3DStuff) init3D();
  document.querySelector("#start").style.opacity = "0";
  document.querySelector("#wrap").style.filter = "";
  setTimeout(() => {
    updateScreenChar(
      "4%... 3%... 2%... Your ship's control panel is beeping very dramatically... one (im not delaying this oupercent..... the thrusters stop, you feel your stomach drop.\n\nWHAM! Your ship slams into the ground. The sudden impact gives you whiplish. Luckily you had coverred the ship in 43 kilograms of electrical tape which cussioned your fall. Electrical tape wins again.\n\n You step out of the capsule and look out onto the lunar surface. You've made it.\n\nAlso why couldnt you have just fired the ascent engine to put you back on a trajectory twords earth when you got disconnected from the command pod. Wouldnt that have-",
      -1,
      false
    );
  }, 750);
}

// 3D Garbage
function init3D() {
  init3DStuff = true;
  const scene = new THREE.Scene();
  const loader = new THREE.STLLoader();
  const renderer = new THREE.WebGLRenderer();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });

  renderer.setSize(
    window.innerWidth * 0.5 - window.innerHeight * 0.025,
    window.innerHeight * 0.5 - window.innerHeight * 0.025
  );
  document.querySelector("#random").appendChild(renderer.domElement);

  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10
  );
  camera.position.z = 5;

  loader.load("assets/lander.stl", (geometry) => {
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(0, -1.5, 0);
    mesh.rotation.set(180, 0, 0);
    mesh.scale.set(1, 1, 1);

    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);

      mesh.rotation.z += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  });

  window.addEventListener("resize", () => {
    renderer.setSize(
      window.innerWidth * 0.5 - window.innerHeight * 0.025,
      window.innerHeight * 0.5 - window.innerHeight * 0.025
    );
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10
    );
    camera.position.z = 5;
  });
}
