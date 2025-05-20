var ManagedView = require('threejs-managed-view');
var loadAndRunScripts = require('loadandrunscripts');
var Resize = require('input-resize');
window.THREE = require('three');

loadAndRunScripts(
	[
		'lib/stats.min.js',
		'lib/threex.rendererstats.js'
	],
	function() {
		var clock = new THREE.Clock();
		var Animal = require('./');
		var Skeleton = require('./Skeleton');
		Resize.minWidth = 600;
		Resize.minHeight = 400;
		
		// Create the view with default settings
		var view = new ManagedView.View({
			stats: true
		});

		// Position the camera
		view.camera.position.set(0, 0, 10);

		// Add orbit controls after the view is fully initialized
		var OrbitControls = require('three-orbit-controls')(THREE);
		var controls = new OrbitControls(view.camera, view.renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;
		controls.screenSpacePanning = false;
		controls.minDistance = 2;
		controls.maxDistance = 20;
		controls.enableZoom = true;
		controls.enablePan = true;
		controls.target.set(0, 1, 0);
		controls.update();

		// Update controls in the render loop
		view.renderManager.onUpdate = function() {
			controls.update();
		};

		// Add lights
		var ambientLight = new THREE.AmbientLight(0x404040);
		view.scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(1, 1, 1).normalize();
		view.scene.add(directionalLight);

		var totalLength = 10;
		var totalSegments = 4;
		var segmentLength = totalLength / totalSegments;
		var skeleton = new Skeleton();
		var skeletonPreview = skeleton.createPreview();
		
		// Center the skeleton
		skeletonPreview.position.y = 0;
		skeletonPreview.scale.multiplyScalar(2);
		view.scene.add(skeletonPreview);

		// Add a grid helper for better spatial reference
		var gridHelper = new THREE.GridHelper(10, 10);
		view.scene.add(gridHelper);

		// Add coordinate axes helper
		var axesHelper = new THREE.AxesHelper(2);
		view.scene.add(axesHelper);

		var bones = [{"parent":-1,"name":"BoneRoot","pos":[0,-.5 * totalLength,0],"rotq":[0,0,0,1]}];
		for (var i = 1; i <= totalSegments; i++) {
			bones.push({"parent":i-1,"name":"Bone"+i+1,"pos":[0,segmentLength,0],"rotq":[0,0,0,1]});
		};

		for(var i = 0, totalAnimals = 1; i < totalAnimals; i++) {
			var animal = new Animal(bones);
			animal.position.x = i - totalAnimals*.5;
			var skelHelp = new THREE.SkeletonHelper(animal);
			view.scene.add(skelHelp);
			view.renderManager.onEnterFrame.add(animal.update);
			view.renderManager.onEnterFrame.add(skelHelp.update.bind(skelHelp));
			view.scene.add(animal);
		}

		var first = true;
		view.renderManager.onEnterFrame.add(function() {
			var delta = clock.getDelta();
			if(first) {
				console.log(animal);
				first = false;
			}
			animal.rotation.y += 0.02;
		})


	}
)