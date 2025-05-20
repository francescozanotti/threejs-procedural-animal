var Vertex = require('../Vertex');
var Edge = require('../Edge');
var SkeletonPreviewPoints = require('./SkeletonPreviewPoints');

function __makeSplittingArguments(boneName, splitTimes, baseName, nameBackwards, proportions){
	if(!proportions) {
		proportions = [];
		for (var i = 0; i < splitTimes; i++) {
			proportions[i] = 1;
		}
	}
	var normalizer = 0;
	for (var i = 0; i < splitTimes; i++) {
		normalizer += proportions[i];
	}

	for (var i = 0; i < splitTimes; i++) {
		proportions[i] /= normalizer;
	}

	var divisions = [];
	var accumilator = 0;
	for (var i = 0; i < splitTimes; i++) {
		accumilator += proportions[i];
		divisions[i] = accumilator;
	}

	var boneNames = [];
	for (var i = 1; i <= splitTimes; i++) {
		boneNames.push(baseName+i);
	}

	if(nameBackwards) {
		boneNames.reverse();
	}
	// ['c7','c6','c5','c4','c3','c2','c1']
	var jointNames = [];
	for (var i = 1; i < splitTimes; i++) {
		jointNames.push(boneNames[i-1] + '-' + boneNames[i]);
	}
	// ['c7-c6','c6-c5','c5-c4','c4-c3','c3-c2','c2-c1']
	return [
		boneName,
		divisions,
		boneNames,
		jointNames
	];
}

function Skeleton() {
	this.joints = {};
	this.bones = {};

	// Core body
	this.addJoint('hip-spine', 0, 0.9, 0);
	this.addJoint('tailTip', 0, 0.8, 0);
	this.addJoint('head-neck', 0, 1.46, 0);
	
	// Left arm and hand
	this.addJoint('l-shoulder', 0.2, 1.4, 0);
	this.addJoint('l-elbow', 0.5, 1.4, 0);
	this.addJoint('l-wrist', 0.8, 1.46, 0);
	this.addJoint('l-thumb-tip', 0.85, 1.5, 0.05);
	this.addJoint('l-index-tip', 0.9, 1.5, 0);
	this.addJoint('l-middle-tip', 0.9, 1.45, 0);
	this.addJoint('l-ring-tip', 0.9, 1.4, 0);
	this.addJoint('l-pinky-tip', 0.85, 1.35, 0);
	
	// Right arm and hand (mirrored)
	this.addJoint('r-shoulder', -0.2, 1.4, 0);
	this.addJoint('r-elbow', -0.5, 1.4, 0);
	this.addJoint('r-wrist', -0.8, 1.46, 0);
	this.addJoint('r-thumb-tip', -0.85, 1.5, 0.05);
	this.addJoint('r-index-tip', -0.9, 1.5, 0);
	this.addJoint('r-middle-tip', -0.9, 1.45, 0);
	this.addJoint('r-ring-tip', -0.9, 1.4, 0);
	this.addJoint('r-pinky-tip', -0.85, 1.35, 0);
	
	// Legs
	this.addJoint('l-hip', 0.15, 0.8, 0);
	this.addJoint('l-knee', 0.15, 0.4, 0);
	this.addJoint('l-ankle', 0.15, 0, 0);
	this.addJoint('l-foot', 0.15, 0, 0.2);
	this.addJoint('l-toe', 0.15, 0, 0.4);
	
	this.addJoint('r-hip', -0.15, 0.8, 0);
	this.addJoint('r-knee', -0.15, 0.4, 0);
	this.addJoint('r-ankle', -0.15, 0, 0);
	this.addJoint('r-foot', -0.15, 0, 0.2);
	this.addJoint('r-toe', -0.15, 0, 0.4);

	// Spine
	this.addBone('spine', 'hip-spine', 'head-neck');
	this.cutBone(
		'spine', 
		[0.2, 0.8],
		['spine-lumbar', 'spine-thoracic', 'spine-cervical'],
		['l1-t12', 't1-c7']
	);
	this.cutBoneManyTimes('spine-cervical', 7, 'spine-c', true);
	this.cutBoneManyTimes('spine-thoracic', 12, 'spine-t', true);
	this.cutBoneManyTimes('spine-lumbar', 5, 'spine-l', true);

	// Left arm
	this.addBone('l-upper-arm', 't1-c7', 'l-shoulder');
	this.addBone('l-upper-arm-bone', 'l-shoulder', 'l-elbow');
	this.addBone('l-lower-arm', 'l-elbow', 'l-wrist');
	
	// Left hand
	this.addBone('l-thumb', 'l-wrist', 'l-thumb-tip');
	this.addBone('l-index', 'l-wrist', 'l-index-tip');
	this.addBone('l-middle', 'l-wrist', 'l-middle-tip');
	this.addBone('l-ring', 'l-wrist', 'l-ring-tip');
	this.addBone('l-pinky', 'l-wrist', 'l-pinky-tip');
	
	// Right arm
	this.addBone('r-upper-arm', 't1-c7', 'r-shoulder');
	this.addBone('r-upper-arm-bone', 'r-shoulder', 'r-elbow');
	this.addBone('r-lower-arm', 'r-elbow', 'r-wrist');
	
	// Right hand
	this.addBone('r-thumb', 'r-wrist', 'r-thumb-tip');
	this.addBone('r-index', 'r-wrist', 'r-index-tip');
	this.addBone('r-middle', 'r-wrist', 'r-middle-tip');
	this.addBone('r-ring', 'r-wrist', 'r-ring-tip');
	this.addBone('r-pinky', 'r-wrist', 'r-pinky-tip');
	
	// Left leg
	this.addBone('l-upper-leg', 'hip-spine', 'l-hip');
	this.addBone('l-thigh', 'l-hip', 'l-knee');
	this.addBone('l-shin', 'l-knee', 'l-ankle');
	this.addBone('l-foot-bone', 'l-ankle', 'l-foot');
	this.addBone('l-toe-bone', 'l-foot', 'l-toe');
	
	// Right leg
	this.addBone('r-upper-leg', 'hip-spine', 'r-hip');
	this.addBone('r-thigh', 'r-hip', 'r-knee');
	this.addBone('r-shin', 'r-knee', 'r-ankle');
	this.addBone('r-foot-bone', 'r-ankle', 'r-foot');
	this.addBone('r-toe-bone', 'r-foot', 'r-toe');

	// Tail (optional)
	this.addBone('tail', 'hip-spine', 'tailTip');
}

Skeleton.prototype.createPreview = function() {
	return new SkeletonPreviewPoints(this);
}

Skeleton.prototype.addJoint = function(name, x, y, z) {
	this.joints[name] = new Vertex(x, y, z);
}

Skeleton.prototype.addBone = function(name, jointNameA, jointNameB) {
	this.bones[name] = new Edge(this.joints[jointNameA], this.joints[jointNameB]);
}

Skeleton.prototype.cutBoneManyTimes = function(boneName, splitTimes, baseName, nameBackwards, proportions) {
	this.cutBone.apply(this, __makeSplittingArguments(boneName, splitTimes, baseName, nameBackwards, proportions));
}

Skeleton.prototype.cutBone = function(boneName, divisions, boneNames, jointNames) {
	var originalBone = this.bones[boneName];
	delete this.bones[boneName];
	var results = originalBone.splitManyTimes(divisions);
	for (var i = 0; i < boneNames.length; i++) {
		this.bones[boneNames[i]] = results.edges[i];
	}
	for (var i = 0; i < boneNames.length; i++) {
		this.joints[jointNames[i]] = results.vertices[i+1];
	}
	originalBone.disconnect();
}

module.exports = Skeleton;