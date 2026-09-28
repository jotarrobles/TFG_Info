// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Representación visual y cinemática de un jugador de rugby en el lienzo táctico.
 */
class TacticalPlayer {
  constructor(data, scene) {
    this.id = data.id || `p-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    this.number = data.number || 10;
    this.name = data.name || `Jugador ${this.number}`;
    this.role = data.role || (this.number <= 8 ? 'forward' : 'back');
    this.team = data.team || 'attack';
    this.color = data.color || (this.team === 'attack' ? '#E63946' : '#1D3557');
    this.metadataLabel = data.metadata_label || '';
    this.waypoints = data.waypoints || [];
    this.scene = scene;

    this.isSelected = false;
    this.isControlled = false; // Modo Control Libre activo

    this.group = new THREE.Group();
    this.group.name = `player-${this.id}`;
    this.group.userData = { type: 'player', entityId: this.id, entity: this };

    this.mesh = null;
    this.ringMesh = null;
    this.selectionRing = null;
    this.labelSprite = null;

    this.build();
    this.scene.add(this.group);

    // Posición inicial según el primer waypoint o origen
    if (this.waypoints.length > 0) {
      this.setPosition(this.waypoints[0].x, this.waypoints[0].y);
    }
  }

  build() {
    const radius = 1.1; // Radio métrico de la ficha en el campo (1.1 metros)

    // 1. Base cilíndrica de la ficha
    const cylGeo = new THREE.CylinderGeometry(radius, radius, 0.35, 32);
    const texture = this.createNumberTexture();
    const matTop = new THREE.MeshBasicMaterial({ map: texture });
    const matSide = new THREE.MeshLambertMaterial({ color: new THREE.Color(this.color) });

    // Materiales del cilindro: [lados, tapa superior, tapa inferior]
    this.mesh = new THREE.Mesh(cylGeo, [matSide, matTop, matSide]);
    this.mesh.rotation.x = Math.PI / 2;
    this.mesh.position.z = 0.2;
    this.group.add(this.mesh);

    // 2. Anillo de rol (Doble aro para Forwards 1-8, aro simple para Backs)
    if (this.role === 'forward') {
      const ringGeo = new THREE.RingGeometry(radius + 0.1, radius + 0.22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
      this.ringMesh.position.z = 0.22;
      this.group.add(this.ringMesh);
    }

    // 3. Aro indicador de selección / Control Libre
    const selGeo = new THREE.RingGeometry(radius + 0.28, radius + 0.45, 32);
    const selMat = new THREE.MeshBasicMaterial({
      color: 0x48cae4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0
    });
    this.selectionRing = new THREE.Mesh(selGeo, selMat);
    this.selectionRing.position.z = 0.23;
    this.group.add(this.selectionRing);

    // 4. Etiqueta de texto (Nombre del jugador)
    this.createNameLabel();
  }

  createNumberTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Fondo con color de equipo
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(64, 64, 62, 0, Math.PI * 2);
    ctx.fill();

    // Borde blanco de alto contraste
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Dorsal
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 62px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.number), 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  createNameLabel() {
    if (this.labelSprite) {
      this.group.remove(this.labelSprite);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect(10, 10, 236, 44, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    this.labelSprite = new THREE.Sprite(spriteMat);
    this.labelSprite.position.set(0, -1.8, 0.5);
    this.labelSprite.scale.set(4, 1, 1);
    this.group.add(this.labelSprite);
  }

  setPosition(x, y) {
    this.group.position.set(x, y, 0);
  }

  getPosition() {
    return { x: this.group.position.x, y: this.group.position.y };
  }

  setSelected(selected) {
    this.isSelected = selected;
    this.updateHighlight();
  }

  setControlled(controlled) {
    this.isControlled = controlled;
    this.updateHighlight();
  }

  updateHighlight() {
    if (this.isControlled) {
      this.selectionRing.material.color.setHex(0xf59e0b); // Ámbar Control Libre
      this.selectionRing.material.opacity = 0.9;
    } else if (this.isSelected) {
      this.selectionRing.material.color.setHex(0x48cae4); // Cian Selección
      this.selectionRing.material.opacity = 0.8;
    } else {
      this.selectionRing.material.opacity = 0.0;
    }
  }

  updateData(newData) {
    if (newData.number !== undefined) this.number = parseInt(newData.number, 10);
    if (newData.name !== undefined) this.name = newData.name;
    if (newData.role !== undefined) this.role = newData.role;
    if (newData.team !== undefined) this.team = newData.team;
    if (newData.color !== undefined) this.color = newData.color;
    if (newData.metadata_label !== undefined) this.metadataLabel = newData.metadata_label;

    // Actualizar textura del dorsal
    const newTexture = this.createNumberTexture();
    this.mesh.material[1].map = newTexture;
    this.mesh.material[1].needsUpdate = true;
    this.mesh.material[0].color.set(this.color);

    this.createNameLabel();
  }

  destroy() {
    this.scene.remove(this.group);
  }
}
