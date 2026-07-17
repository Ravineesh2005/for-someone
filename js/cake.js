// 3D Cake Logic using Three.js
let scene, camera, renderer, flame, cakeGroup;
let isCakeInitialized = false;

function initCake() {
    if (isCakeInitialized) return;
    isCakeInitialized = true;

    const container = document.getElementById('cake-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent to show container background

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Ambient Light (Dimmed for dark mode)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main Directional Light
    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Warm Gold Backlight
    const backLight = new THREE.DirectionalLight(0xd4af37, 0.8);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Candle Point Light
    const pointLight = new THREE.PointLight(0xffd700, 1.5, 12);
    pointLight.position.set(0, 3, 0); // Near the candle
    scene.add(pointLight);

    // Cake Group
    cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Cake Base (Dark Velvet / Chocolate)
    const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({ 
        color: 0x1a0f14, 
        roughness: 0.9,
        metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.75;
    base.castShadow = true;
    base.receiveShadow = true;
    cakeGroup.add(base);

    // Cake Top (Metallic Gold Frosting)
    const topGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.2, 32);
    const topMat = new THREE.MeshStandardMaterial({ 
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.8
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 1.6;
    top.castShadow = true;
    top.receiveShadow = true;
    cakeGroup.add(top);

    // Frosting Drips
    for (let i = 0; i < 12; i++) {
        const dripGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const drip = new THREE.Mesh(dripGeo, topMat);
        drip.scale.y = Math.random() * 2 + 1.5; // Stretch vertically
        const angle = (i / 12) * Math.PI * 2;
        drip.position.set(Math.cos(angle) * 2.5, 1.4, Math.sin(angle) * 2.5);
        drip.castShadow = true;
        cakeGroup.add(drip);
    }

    // Candle
    const candleGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xffe6e9 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = 2.2;
    candle.castShadow = true;
    cakeGroup.add(candle);

    // Candle Wick
    const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.y = 2.75;
    cakeGroup.add(wick);

    // Flame
    const flameGeo = new THREE.ConeGeometry(0.1, 0.3, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 3.0;
    cakeGroup.add(flame);

    // Glow around flame
    const glowGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0xffd700, 
        transparent: true, 
        opacity: 0.5 
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 3.0;
    cakeGroup.add(glow);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // Flicker flame
        const time = Date.now() * 0.01;
        flame.scale.x = 1 + Math.sin(time) * 0.1;
        flame.scale.z = 1 + Math.cos(time) * 0.1;
        flame.scale.y = 1 + Math.sin(time * 2) * 0.1;
        
        glow.scale.setScalar(1 + Math.sin(time) * 0.2);
        pointLight.intensity = 1 + Math.sin(time) * 0.2;

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
}
