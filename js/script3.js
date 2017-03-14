/**
 *
 * WebGL With Three.js - Lesson 11 - Animated Objects
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-11/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, Script Tutorials
 * http://www.script-tutorials.com/
 */

var lesson11 = {
  scene: null, camera: null, renderer: null,
  container: null, controls: null,
  clock: null, stats: null,

  init: function() {

    // Create main scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xc8e0ff, 0.0003);

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    // Prepare perspective camera
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(100, 0, 0);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // Prepare webgl renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(this.scene.fog.color);

    // Prepare container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // Events
    THREEx.WindowResize(this.renderer, this.camera);

    // Prepare Orbit controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.maxDistance = 150;

    // Prepare clock
    this.clock = new THREE.Clock();

    // Prepare stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '50px';
    this.stats.domElement.style.bottom = '50px';
    this.stats.domElement.style.zIndex = 1;
    this.container.appendChild( this.stats.domElement );

    // Add lights
    this.scene.add( new THREE.AmbientLight(0xFFFFFF));

    // Load Json model
    // this.loadJsonModel();

    // Load Dae model
    this.loadDaeModel();
  },
  loadJsonModel: function() {

    // Prepare JSONLoader
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.load('models/girl.json', function(geometry, materials) {

      materials.forEach(function(mat) {
        mat.skinning = true;
      });

      // Prepare SkinnedMesh with MeshFaceMaterial (using original texture)
      var modelMesh = new THREE.SkinnedMesh(
        geometry, new THREE.MeshFaceMaterial(materials)
      );

      // Set position and scale
      var scale = 40;
      modelMesh.position.set(0, -20, 0);
      modelMesh.scale.set(scale, scale, scale);

      // Prepare animation
      var animation = new THREE.Animation(
        modelMesh, geometry.animations[0],
        THREE.AnimationHandler.CATMULLROM
      );

      // Add the mesh and play the animation
      lesson11.scene.add(modelMesh);
      animation.play();
    });

  },
  loadDaeModel: function() {

    // Prepare ColladaLoader
    var daeLoader = new THREE.ColladaLoader();
    daeLoader.options.convertUpAxis = true;
    daeLoader.load('models/monster.dae', function(collada) {

      var modelMesh = collada.scene;

      // Prepare and play animation
      modelMesh.traverse( function (child) {
        if (child instanceof THREE.SkinnedMesh) {
          var animation = new THREE.Animation(child, child.geometry.animation);
          animation.play();
        }
      } );

      // Set position and scale
      var scale = 0.023;
      modelMesh.position.set(0, -10, 0);
      modelMesh.scale.set(scale, scale, scale);

      // Add the mesh into scene
      lesson11.scene.add(modelMesh);
    });

  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  var delta = lesson11.clock.getDelta();

  lesson11.controls.update(delta);
  lesson11.stats.update();

  THREE.AnimationHandler.update(delta);
}

// Render the scene
function render() {
  if (lesson11.renderer) {
    lesson11.renderer.render(lesson11.scene, lesson11.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  lesson11.init();
  animate();
}

if (window.addEventListener)
  window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
  window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
