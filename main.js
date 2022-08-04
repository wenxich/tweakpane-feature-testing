import './style.css';

import * as THREE from 'three';

import {Pane} from 'tweakpane';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

/** TWEAKPANE
 * NOTES: I'm sure there's a way to drag the panel using jQuery or JS, but I haven't figured it out yet
 * For now, I'm just positioning it depending on the location of a HTML container
 */

//initialize global variables
let globalWidth = 2, globalHeight = 2, globalDepth = 2;

const pane = new Pane({
    container: document.getElementById('container'),
});

const tab = pane.addTab({
    pages: [
        {title: 'Parameters'},
        {title: 'Advanced'},
    ],
});

// tweakpane - width

const widthParams = {
    width: 2,
};
tab.pages[0].addInput(widthParams, 'width', {
    min: 1,
    max: 5,
}).on('change', (ev) => {
    boxMesh.geometry.dispose();
    globalWidth = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
});

// tweakpane - height

const heightParams = {
    height: 2,
};
tab.pages[0].addInput(heightParams, 'height', {
    min: 1,
    max: 5,
}).on('change', (ev) => {
    boxMesh.geometry.dispose();
    globalHeight = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
});

// tweakpane - depth

const depthParams = {
    depth: 2,
};
tab.pages[0].addInput(depthParams, 'depth', {
    min: 1,
    max: 5,
}).on('change', (ev) => {
    boxMesh.geometry.dispose();
    globalDepth = ev.value;
    boxMesh.geometry = new THREE.BoxGeometry(
        globalWidth,
        globalHeight,
        globalDepth
    );
});

//tweakpane - color (new feature!)

const colorParams = {
    skin: '#FF0005'
};
tab.pages[1].addInput(colorParams, 'skin')
    .on('change', (ev) => boxMesh.material.color.set(ev.value));

//THREE.JS SCENE

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000); //field of view (degrees), aspect ratio (fraction) + 2 clipping planes
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);

//tell three.js the pixel ratio so the graphics are supported on browsers with different displays
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement); //insert this into body

//create new OrbitControls object
new OrbitControls(camera, renderer.domElement);

//makes what's in front of the black screen visible
camera.position.z = 5;

//add a box
//parameters: width, height, depth
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);

//won't see anything unless you create a mesh, so create a mesh + object

//MeshPhongMaterial adds lighting to plane in comparison to MeshBasicMaterial
const boxMaterial = new THREE.MeshPhongMaterial(
    {
        //colors: https://libxlsxwriter.github.io/working_with_colors.html
        color: 0x800000,

        //make back visible
        side: THREE.DoubleSide,

        //make vertices making the plane visible
        flatShading: THREE.FlatShading
    });

//adds the mesh to the scene
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

//parameters: color, intensity
const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
frontLight.position.set(0, 0, 1);
scene.add(frontLight);

//parameters: color, intensity
const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(0, 0, -1);
scene.add(backLight);

//parameters: color, intensity
const rightLight = new THREE.DirectionalLight(0xffffff, 1.0);
rightLight.position.set(1, 0, 0);
scene.add(rightLight);

//parameters: color, intensity
const leftLight = new THREE.DirectionalLight(0xffffff, 1.0);
leftLight.position.set(-1, 0, 0);
scene.add(leftLight);

//parameters: color, intensity
const upLight = new THREE.DirectionalLight(0xffffff, 1.0);
upLight.position.set(0, 1, 0);
scene.add(upLight);

//parameters: color, intensity
const downLight = new THREE.DirectionalLight(0xffffff, 1.0);
downLight.position.set(0, -1, 0);
scene.add(downLight);

//renders it all
renderer.render(scene, camera);

//add an animation

//create recursive function to keep updating the animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //planeMesh.rotation.x += 0.01;
}

//call the recursive function
animate();