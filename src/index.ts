import * as THREE from "three";

import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3, Material, Matrix3, Matrix4, Vector2 } from "three";

import jylland from "./assets/jylland.png";
import me from "./assets/me_hat.jpg";
import firl_img from "./assets/firl/firl.jpg";

import { JyllandLower, JyllandUpper } from "./drawings/jylland";
import { Face } from "./drawings/face/face";
import { Alphabet } from "./drawings/aplhabet";
import { Firl } from "./drawings/firl/firl";

var camera: THREE.PerspectiveCamera;
var controls: MapControls;
var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var parentTransform: THREE.Object3D;
var lineGeometry: THREE.BufferGeometry;
var line: THREE.Line;
var raycaster = new THREE.Raycaster();
var maxPoints: number = 1500;
var nextPoint: number = 0;
var text: Alphabet;
var face: Face;

var setValue: number = 0.5;

var firl: Firl;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgba(196, 167, 125,255)");
  // scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(
    154.97851141186976,
    37.35992839924122,
    -183.34278406105298
  );
  camera.setRotationFromEuler(
    new THREE.Euler(
      -2.983379355647506,
      0.5039444306411702,
      3.064702069678876,
      "XYZ"
    )
  );

  // controls

  controls = new MapControls(camera, renderer.domElement);
  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 9000;
  controls.object.position.z = 100;

  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 2;

  // controls.minAzimuthAngle = 0;
  // controls.maxAzimuthAngle = 0;

  controls.enabled = true;

  // world
  lineGeometry = new THREE.BufferGeometry();

  var positions = new Float32Array(maxPoints * 3);

  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // draw range
  var drawCount = 2; // draw the first 2 points, only
  lineGeometry.setDrawRange(0, drawCount);

  var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  line = new THREE.Line(lineGeometry, lineMaterial);

  scene.add(line);
  // lights

  //Draw
  // var jyllandLower = new JyllandLower(scene);
  // jyllandLower.draw(2);
  // var jyllandUpper = new JyllandUpper(scene);
  // jyllandUpper.draw(2);

  //Resize
  window.addEventListener("resize", onWindowResize, false);

  //Debug
  //   var axesHelper = new THREE.AxesHelper(10);
  //   scene.add(axesHelper);

  ////////////Image
  //   var map = new THREE.TextureLoader().load(firl_img);
  //   var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
  //   var sprite = new THREE.Sprite(material);
  //   var scale = 40;
  //   sprite.position.setZ(-4);
  //   sprite.scale.set(scale, scale, 1);
  //   scene.add(sprite);

  //////////////Interaction
//   renderer.domElement.addEventListener("mousedown", addPoints, false);
//   document.addEventListener("keypress", logKey);

  //Write text
  text = new Alphabet(scene, 0.75);
  text.setPosition(6, 25, 30);

  //Draw face
  face = new Face(scene, 2);

  //Draw firl
  firl = new Firl(scene, 2);
}

function logKey(event: KeyboardEvent) {
  var tempGeo = line.geometry as THREE.BufferGeometry;
  var tempAtt = tempGeo.attributes.position as THREE.BufferAttribute;
  var positions = tempAtt.array;

  console.log(res);

  if (event.code == "KeyS") {
    var name = prompt("Please enter your name", "");
    if (name == null || name == "") {
      console.log("User cancelled the prompt.");
    } else {
      console.log(res);
      download(JSON.stringify(res), name + ".json", "");
    }
    // download(JSON.stringify(res), "jylland.json", "");
  }
  if (event.code == "KeyU") {
    console.log("update");
    text.setRotation(camera.matrixWorld);
  }

  if (event.code == "KeyW") {
    setValue += 0.5;
    console.log(setValue);
  }
  if (event.code == "KeyQ") {
    setValue -= 0.5;
    console.log(setValue);
  }
}

var res: any = {};
var nextStartIndex = 0;
function addPoints(event: MouseEvent) {
  var tempGeo = line.geometry as THREE.BufferGeometry;
  var tempAtt = tempGeo.attributes.position as THREE.BufferAttribute;
  var positions = tempAtt.array as Array<number>;
  var drawCount = tempAtt.array.length;

  if (event.shiftKey || true) {
    var list = positions.slice(nextStartIndex, nextPoint);
    res[nextStartIndex] = list;
    nextStartIndex = nextPoint;
  }

  var mouse3D = new Vector3(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(new Vector2(mouse3D.x, mouse3D.y), camera);

  var zIntecest: Vector3;
  zIntecest = raycaster.ray.intersectPlane(
    new THREE.Plane(new THREE.Vector3(0, 0, 1)),
    zIntecest
  );

  positions[nextPoint] = zIntecest.x;
  positions[nextPoint + 1] = zIntecest.y;
  positions[nextPoint + 2] = setValue;
  nextPoint += 3;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate.bind(this));
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  var tempGeo = line.geometry as THREE.BufferGeometry;
  var tempAtt = tempGeo.attributes.position as THREE.BufferAttribute;

  tempGeo.setDrawRange(0, nextPoint / 3);
  tempAtt.needsUpdate = true; // required after the first render

  //Update pos
  if (face != null) {
    // face.rotateEyes(camera.matrix);
  }
  if (text != null) {
    text.setRotation(camera.matrixWorld);
  }

//   console.log(camera.position);
//   console.log(camera.scale);
//   console.log(camera.rotation);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function download(content: string, fileName: string, contentType: string) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function drawData(data: any) {
  for (const property in data) {
    var tempGeo = line.geometry as THREE.BufferGeometry;
    var tempAtt = tempGeo.attributes.position as THREE.BufferAttribute;
    var positions = tempAtt.array as Array<number>;
    positions[nextPoint] = data[property];
    nextPoint++;
  }
}
