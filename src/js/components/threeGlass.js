/* Lassi Emotions - Three.js 3D WebGL Glass & Liquid Simulation */

export class ThreeGlassComponent {
  constructor(canvasElement, dataset) {
    this.canvas = canvasElement;
    this.dataset = dataset;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.glassMesh = null;
    this.liquidMesh = null;
    this.iceCubes = [];
    this.toppingsGroup = null;

    this.targetColor1 = new THREE.Color('#fff1b8');
    this.targetColor2 = new THREE.Color('#ffb703');

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') return;

    const width = 390;
    const height = 510;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 14);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffd57e, 1.5, 20);
    pointLight.position.set(-4, 3, 5);
    this.scene.add(pointLight);

    // 4. 3D Glass Outer Mesh (Bulging Tumbler Shape)
    const glassPoints = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const y = (t - 0.5) * 7.5;
      const r = 2.1 + Math.sin(t * Math.PI) * 0.95; // Bulging belly
      glassPoints.push(new THREE.Vector2(r, y));
    }
    const glassGeo = new THREE.LatheGeometry(glassPoints, 36);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.92,
      ior: 1.5,
      transparent: true,
      opacity: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    this.glassMesh = new THREE.Mesh(glassGeo, glassMat);
    this.scene.add(this.glassMesh);

    // 5. 3D Liquid Inner Mesh
    const liquidGeo = new THREE.CylinderGeometry(2.6, 2.1, 5.8, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.3,
      metalness: 0.1
    });
    this.liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    this.liquidMesh.position.y = -0.4;
    this.scene.add(this.liquidMesh);

    // 6. Floating 3D Ice Cubes
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });

    for (let i = 0; i < 2; i++) {
      const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const cube = new THREE.Mesh(cubeGeo, iceMat);
      cube.position.set(i === 0 ? -0.8 : 0.8, 1.8, 0.5);
      cube.rotation.set(Math.random(), Math.random(), 0);
      this.scene.add(cube);
      this.iceCubes.push(cube);
    }

    // 7. 3D Toppings Group
    this.toppingsGroup = new THREE.Group();
    this.toppingsGroup.position.y = 2.4;
    this.scene.add(this.toppingsGroup);

    // Render loop
    this.animate();
  }

  render(state) {
    if (!this.renderer) return;

    const emotion = this.dataset.emotions.find(e => e.id === state.currentEmotion);
    if (!emotion || !emotion.colors) return;

    const [c1, c2] = emotion.colors;
    this.targetColor1.set(c1);
    this.targetColor2.set(c2);

    if (this.liquidMesh) {
      this.liquidMesh.material.color.set(c2);
    }

    // Update 3D Toppings
    this.render3DTopping(state.topping);
  }

  render3DTopping(toppingId) {
    if (!this.toppingsGroup) return;

    // Clear existing 3D topping meshes
    while (this.toppingsGroup.children.length > 0) {
      this.toppingsGroup.remove(this.toppingsGroup.children[0]);
    }

    if (toppingId === 'saffron') {
      const saffronMat = new THREE.MeshBasicMaterial({ color: 0xff6d00 });
      for (let i = 0; i < 5; i++) {
        const geo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
        const mesh = new THREE.Mesh(geo, saffronMat);
        mesh.position.set((Math.random() - 0.5) * 2.2, 0, (Math.random() - 0.5) * 2.2);
        mesh.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
        this.toppingsGroup.add(mesh);
      }
    } else if (toppingId === 'pistachio') {
      const pistaMat = new THREE.MeshStandardMaterial({ color: 0x76ba1b, roughness: 0.6 });
      for (let i = 0; i < 8; i++) {
        const geo = new THREE.SphereGeometry(0.18, 6, 6);
        const mesh = new THREE.Mesh(geo, pistaMat);
        mesh.position.set((Math.random() - 0.5) * 2.4, 0, (Math.random() - 0.5) * 2.4);
        this.toppingsGroup.add(mesh);
      }
    } else if (toppingId === 'rose') {
      const roseMat = new THREE.MeshStandardMaterial({ color: 0xd81b60, roughness: 0.4 });
      for (let i = 0; i < 4; i++) {
        const geo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 12);
        const mesh = new THREE.Mesh(geo, roseMat);
        mesh.position.set((Math.random() - 0.5) * 2.0, 0, (Math.random() - 0.5) * 2.0);
        mesh.rotation.set(0.2, Math.random() * Math.PI, 0);
        this.toppingsGroup.add(mesh);
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.renderer || !this.scene || !this.camera) return;

    const time = Date.now() * 0.0015;

    // Gentle 3D Glass Floating Physics
    if (this.glassMesh) {
      this.glassMesh.rotation.y = Math.sin(time * 0.5) * 0.15;
    }
    if (this.liquidMesh) {
      this.liquidMesh.rotation.y = Math.sin(time * 0.5) * 0.15;
    }

    // Ice cube buoyant rotation & bobbing
    this.iceCubes.forEach((cube, idx) => {
      cube.position.y = 1.8 + Math.sin(time * 2 + idx) * 0.12;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.012;
    });

    this.renderer.render(this.scene, this.camera);
  }
}
