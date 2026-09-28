// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Gestor del motor de renderizado y escena Three.js en vista ortográfica cenital.
 */
class TacticalEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.plane = null; // Plano de intersección Z=0
    
    // Configuración de vista y zoom métrico
    this.frustumSize = 90; // metros visibles en vertical por defecto
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.currentFraming = 'full_pitch';
    
    // Callbacks de animación por frame
    this.updateCallbacks = [];
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f17); // Fondo neutral exterior

    // 2. Cámara ortográfica (Elimina distorsión de perspectiva, métrica pura)
    const halfH = this.frustumSize / 2;
    const halfW = halfH * this.aspectRatio;
    this.camera = new THREE.OrthographicCamera(
      -halfW, halfW, halfH, -halfH, 0.1, 1000
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderizador WebGL
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Luces básicas
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(20, 40, 100);
    this.scene.add(dirLight);

    // 5. Plano de cálculo de colisiones matemáticas Z=0
    const planeGeo = new THREE.PlaneGeometry(300, 300);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    this.plane = new THREE.Mesh(planeGeo, planeMat);
    this.scene.add(this.plane);

    // 6. Listeners de ventana
    window.addEventListener('resize', () => this.onWindowResize());

    // 7. Arrancar bucle
    this.renderLoop();
  }

  onWindowResize() {
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.updateCameraFrustum();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateCameraFrustum() {
    const halfH = this.frustumSize / 2;
    const halfW = halfH * this.aspectRatio;
    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();
  }

  setFraming(preset) {
    this.currentFraming = preset;
    
    // Coordenadas oficiales: Centro del campo (0,0), Largo -60 a +60m, Ancho -35 a +35m
    if (preset === 'full_pitch') {
      this.frustumSize = 92;
      this.camera.position.set(0, 0, 100);
    } else if (preset === 'half_pitch') {
      this.frustumSize = 75;
      this.camera.position.set(25, 0, 100); // Foco en campo de ataque derecho
    } else if (preset === 'twenty_two') {
      this.frustumSize = 55;
      this.camera.position.set(40, 0, 100); // Zona de 22m derecha
    } else if (preset === 'scrum') {
      this.frustumSize = 40;
      this.camera.position.set(10, 10, 100);
    } else if (preset === 'lineout') {
      this.frustumSize = 35;
      this.camera.position.set(5, 25, 100);
    }
    
    this.updateCameraFrustum();
  }

  screenToWorld(clientX, clientY) {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.plane);

    let result = null;
    if (intersects.length > 0) {
      result = intersects[0].point;
    }
    return result;
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  renderLoop() {
    requestAnimationFrame(() => this.renderLoop());

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Ejecutar listeners de actualización
    for (let i = 0; i < this.updateCallbacks.length; i++) {
      this.updateCallbacks[i](dt);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
