// app.js

// Set up scene
var scene = new THREE.Scene();

// Set up camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Set up renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create stars
var starsGeometry = new THREE.BufferGeometry();
var starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

var starsVertices = [];
var starsSizes = [];
var starsBrightness = [];

for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;

    starsVertices.push(x, y, z);

    // Generate random size and brightness
    const size = Math.random() * 0.5 + 0.1; // Sizes between 0.1 and 0.6
    const brightness = Math.random() * 0.5 + 0.5; // Brightness between 0.5 and 1

    starsSizes.push(size * 10); // Scale size for better visibility
    starsMaterial.size = size; // Assign size to material
    starsBrightness.push(brightness);
}

// Make a few stars brighter
for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * starsBrightness.length);
    starsBrightness[index] = Math.random() * 0.5 + 0.8; // Set brightness between 0.8 and 1.3
}

// Make a few stars bigger
for (let i = 0; i < 20; i++) {
    const index = Math.floor(Math.random() * starsSizes.length);
    starsSizes[index] = Math.random() * 0.5 + 0.8; // Set size between 0.8 and 1.3
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1));
starsGeometry.setAttribute('brightness', new THREE.Float32BufferAttribute(starsBrightness, 1));

var stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Create new moon (crescent)
var moonGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100); // TorusGeometry creates a crescent shape
var moonMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
var moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(10, 0, 0); // Position the moon to the right of the scene
scene.add(moon);

// Create comet
var cometGeometry = new THREE.BufferGeometry();
var cometMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.2 });

var cometVertices = [];
var cometSize = 0.2;

cometGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cometVertices, 3));

var comet = new THREE.Points(cometGeometry, cometMaterial);
scene.add(comet);

// Time variables for comet appearance
var startTime = Date.now();
var cometInterval = 30 * 1000; // 30 seconds in milliseconds

// Animation function
var animate = function () {
    requestAnimationFrame(animate);

    // Rotate the stars
    stars.rotation.y += 0.001;

    // Rotate the moon
    moon.rotation.y += 0.001;

    // Update comet position every frame
    var elapsedTime = Date.now() - startTime;
    if (elapsedTime > cometInterval) {
        // Reset start time for the next comet appearance
        startTime = Date.now();

        // Randomize comet starting position along the y-axis
        comet.position.x = (Math.random() - 0.5) * 10;
        comet.position.y = (Math.random() - 0.5) * 5;
        comet.position.z = -20;

        // Randomize comet speed
        var cometSpeed = Math.random() * 0.02 + 0.02;

        // Animate the comet's movement
        cometAnimation(comet, cometSpeed);
    }

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', function () {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Start the animation loop
animate();

// Function to animate comet movement
function cometAnimation(comet, speed) {
    var duration = 3000; // Duration of the comet animation in milliseconds

    var startPosition = { x: comet.position.x, y: comet.position.y, z: comet.position.z };
    var endPosition = { x: 20, y: comet.position.y, z: 0 };

    var startRotation = { x: comet.rotation.x, y: comet.rotation.y, z: comet.rotation.z };
    var endRotation = { x: 0, y: 0, z: 0 };

    new TWEEN.Tween(comet.position)
        .to(endPosition, duration)
        .start();

    new TWEEN.Tween(comet.rotation)
        .to(endRotation, duration)
        .start();
}
