// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Ánh sáng
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(0,0,0);
scene.add(pointLight);

// Loader texture
const loader = new THREE.TextureLoader();
const textures = {
    sun: 'https://i.ibb.co/7XfPZzX/sun.jpg',
    mercury: 'https://i.ibb.co/N2c0z2b/mercury.jpg',
    venus: 'https://i.ibb.co/qM3qvxB/venus.jpg',
    earth: 'https://i.ibb.co/0B1wDqS/earth.jpg',
    moon: 'https://i.ibb.co/3y6fVwK/moon.jpg',
    mars: 'https://i.ibb.co/f0Rs6pZ/mars.jpg',
    jupiter: 'https://i.ibb.co/1v9ZfZb/jupiter.jpg',
    saturn: 'https://i.ibb.co/3Wh0Y72/saturn.jpg',
    uranus: 'https://i.ibb.co/6JDnYQm/uranus.jpg',
    neptune: 'https://i.ibb.co/5kPrfHc/neptune.jpg'
};

// Mặt Trời
const sunGeo = new THREE.SphereGeometry(3, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({map: loader.load(textures.sun)});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Hàm tạo hành tinh
function createPlanet(size, texture, distance) {
    const geo = new THREE.SphereGeometry(size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({map: loader.load(texture)});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = distance;
    scene.add(mesh);
    return mesh;
}

// Tạo các hành tinh
const planets = [
    {name:'Mercury', mesh:createPlanet(0.2, textures.mercury, 5), speed:0.04},
    {name:'Venus', mesh:createPlanet(0.5, textures.venus, 7), speed:0.015},
    {name:'Earth', mesh:createPlanet(0.6, textures.earth, 10), speed:0.01},
    {name:'Mars', mesh:createPlanet(0.4, textures.mars, 13), speed:0.008},
    {name:'Jupiter', mesh:createPlanet(1.2, textures.jupiter, 17), speed:0.004},
    {name:'Saturn', mesh:createPlanet(1, textures.saturn, 21), speed:0.003},
    {name:'Uranus', mesh:createPlanet(0.8, textures.uranus, 25), speed:0.002},
    {name:'Neptune', mesh:createPlanet(0.7, textures.neptune, 29), speed:0.0018}
];

// Mặt Trăng quay quanh Trái Đất
const moonGeo = new THREE.SphereGeometry(0.15, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({map: loader.load(textures.moon)});
const moon = new THREE.Mesh(moonGeo, moonMat);
scene.add(moon);

// Camera
camera.position.z = 50;

// Quay quanh Mặt Trời
let angles = planets.map(()=>0);
let moonAngle = 0;

function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.004;

    planets.forEach((planet, index)=>{
        angles[index] += planet.speed;
        const dist = planet.mesh.position.x;
        planet.mesh.position.x = Math.cos(angles[index]) * dist;
        planet.mesh.position.z = Math.sin(angles[index]) * dist;
        planet.mesh.rotation.y += 0.02;
    });

    // Mặt Trăng quay quanh Trái Đất
    const earth = planets[2].mesh;
    moonAngle += 0.05;
    moon.position.x = earth.position.x + Math.cos(moonAngle) * 1;
    moon.position.z = earth.position.z + Math.sin(moonAngle) * 1;
    moon.position.y = earth.position.y;
    moon.rotation.y += 0.02;

    renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', ()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
