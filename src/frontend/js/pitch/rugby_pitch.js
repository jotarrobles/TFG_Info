// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Generador geométrico del terreno de juego reglamentario de Rugby (World Rugby Law 1).
 * Escala 1:1 métrica (1 unidad Three.js = 1 metro).
 */
class RugbyPitch {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'rugby-pitch';
    
    // Dimensiones oficiales
    this.fieldLength = 100; // Entre líneas de ensayo (-50m a +50m)
    this.inGoalLength = 10; // Zona de ensayo en cada extremo
    this.totalLength = 120; // 100m + 20m in-goals (-60m a +60m)
    this.fieldWidth = 70;   // Línea de banda a línea de banda (-35m a +35m)
    
    this.lineColor = 0xf8f9fa;
    this.grassColor = 0x1b4332;
    this.inGoalColor = 0x143628;

    this.build();
    this.scene.add(this.group);
  }

  build() {
    this.createSurfaces();
    this.createPerimeterLines();
    this.createRegulationLines();
    this.createDashedLines();
    this.createGoalPosts();
    this.createFieldMarkingsText();
  }

  createSurfaces() {
    // 1. Superficie de campo de juego (100m x 70m)
    const playFieldGeo = new THREE.PlaneGeometry(this.fieldLength, this.fieldWidth);
    const playFieldMat = new THREE.MeshLambertMaterial({ color: this.grassColor });
    const playField = new THREE.Mesh(playFieldGeo, playFieldMat);
    playField.position.set(0, 0, -0.05);
    this.group.add(playField);

    // 2. Zonas de ensayo (In-goals, 10m x 70m cada una)
    const inGoalGeo = new THREE.PlaneGeometry(this.inGoalLength, this.fieldWidth);
    const inGoalMat = new THREE.MeshLambertMaterial({ color: this.inGoalColor });

    // In-goal izquierdo (-55m)
    const inGoalLeft = new THREE.Mesh(inGoalGeo, inGoalMat);
    inGoalLeft.position.set(-55, 0, -0.05);
    this.group.add(inGoalLeft);

    // In-goal derecho (+55m)
    const inGoalRight = new THREE.Mesh(inGoalGeo, inGoalMat);
    inGoalRight.position.set(55, 0, -0.05);
    this.group.add(inGoalRight);

    // 3. Área perimetral de seguridad (césped exterior)
    const surroundGeo = new THREE.PlaneGeometry(this.totalLength + 10, this.fieldWidth + 10);
    const surroundMat = new THREE.MeshLambertMaterial({ color: 0x0f2d21 });
    const surround = new THREE.Mesh(surroundGeo, surroundMat);
    surround.position.set(0, 0, -0.1);
    this.group.add(surround);
  }

  createLine(p1, p2, width = 0.15, isDashed = false) {
    const material = isDashed
      ? new THREE.LineDashedMaterial({
          color: this.lineColor,
          dashSize: 1.5,
          gapSize: 1.5,
          linewidth: 1,
        })
      : new THREE.LineBasicMaterial({
          color: this.lineColor,
          linewidth: 1,
        });

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(p1.x, p1.y, 0.01),
      new THREE.Vector3(p2.x, p2.y, 0.01),
    ]);

    const line = new THREE.Line(geometry, material);
    if (isDashed) {
      line.computeLineDistances();
    }
    this.group.add(line);
  }

  createPerimeterLines() {
    const halfW = this.fieldWidth / 2; // 35m
    const deadL = this.totalLength / 2; // 60m

    // Líneas de banda superior e inferior
    this.createLine({ x: -deadL, y: halfW }, { x: deadL, y: halfW });
    this.createLine({ x: -deadL, y: -halfW }, { x: deadL, y: -halfW });

    // Líneas de balón muerto (Dead-ball lines en -60m y +60m)
    this.createLine({ x: -deadL, y: -halfW }, { x: -deadL, y: halfW });
    this.createLine({ x: deadL, y: -halfW }, { x: deadL, y: halfW });
  }

  createRegulationLines() {
    const halfW = this.fieldWidth / 2;

    // 1. Línea de medio campo (50m, en X = 0)
    this.createLine({ x: 0, y: -halfW }, { x: 0, y: halfW });

    // 2. Líneas de ensayo (Try lines, en X = -50m y X = +50m)
    this.createLine({ x: -50, y: -halfW }, { x: -50, y: halfW });
    this.createLine({ x: 50, y: -halfW }, { x: 50, y: halfW });

    // 3. Líneas de 22 metros (en X = -28m y X = +28m)
    this.createLine({ x: -28, y: -halfW }, { x: -28, y: halfW });
    this.createLine({ x: 28, y: -halfW }, { x: 28, y: halfW });
  }

  createDashedLines() {
    const halfW = this.fieldWidth / 2;

    // 1. Líneas de 10 metros discontinuas (en X = -10m y X = +10m)
    this.createLine({ x: -10, y: -halfW }, { x: -10, y: halfW }, 0.15, true);
    this.createLine({ x: 10, y: -halfW }, { x: 10, y: halfW }, 0.15, true);

    // 2. Líneas longitudinales de 5m de banda (en Y = -30m y Y = +30m)
    this.createLine({ x: -50, y: 30 }, { x: 50, y: 30 }, 0.15, true);
    this.createLine({ x: -50, y: -30 }, { x: 50, y: -30 }, 0.15, true);

    // 3. Líneas longitudinales de 15m de banda (en Y = -20m y Y = +20m)
    this.createLine({ x: -50, y: 20 }, { x: 50, y: 20 }, 0.15, true);
    this.createLine({ x: -50, y: -20 }, { x: 50, y: -20 }, 0.15, true);

    // 4. Líneas de 5m de ensayo (en X = -45m y X = +45m)
    this.createLine({ x: -45, y: -halfW }, { x: -45, y: halfW }, 0.15, true);
    this.createLine({ x: 45, y: -halfW }, { x: 45, y: halfW }, 0.15, true);
  }

  createGoalPosts() {
    // Postes de ensayo en forma de H en X = -50m y X = +50m (ancho 5.6m)
    const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12);
    const postMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const postPositions = [
      { x: -50, y: -2.8 }, { x: -50, y: 2.8 },
      { x: 50, y: -2.8 }, { x: 50, y: 2.8 }
    ];

    postPositions.forEach(pos => {
      const mesh = new THREE.Mesh(postGeo, postMat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.set(pos.x, pos.y, 0.4);
      this.group.add(mesh);
    });
  }

  createFieldMarkingsText() {
    // Marcados textuales tácticos sobre el césped ("22", "10", etc.)
    const markings = [
      { text: '22', x: -28, y: 32 },
      { text: '22', x: -28, y: -32 },
      { text: '10', x: -10, y: 32 },
      { text: '10', x: -10, y: -32 },
      { text: '10', x: 10, y: 32 },
      { text: '10', x: 10, y: -32 },
      { text: '22', x: 28, y: 32 },
      { text: '22', x: 28, y: -32 },
    ];

    markings.forEach(m => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(248, 249, 250, 0.45)';
      ctx.font = 'bold 58px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.text, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(m.x, m.y, 0.02);
      sprite.scale.set(3, 3, 1);
      this.group.add(sprite);
    });
  }
}
