// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Representación del Balón de Rugby con forma ovalada y costuras características.
 */
class TacticalBall {
  constructor(data, scene) {
    this.id = data.id || 'e-ball';
    this.number = 0;
    this.name = 'Balón';
    this.role = 'ball';
    this.team = 'neutral';
    this.color = data.color || '#E9C46A';
    this.waypoints = data.waypoints || [];
    this.scene = scene;

    this.isSelected = false;
    this.attachedTo = null; // Jugador portador si aplica

    this.group = new THREE.Group();
    this.group.name = `ball-${this.id}`;
    this.group.userData = { type: 'ball', entityId: this.id, entity: this };

    this.mesh = null;
    this.selectionRing = null;

    this.build();
    this.scene.add(this.group);

    if (this.waypoints.length > 0) {
      this.setPosition(this.waypoints[0].x, this.waypoints[0].y);
    }
  }

  build() {
    // 1. Geometría ovalada (esfera estirada en eje X: esferoide prolato)
    const sphereGeo = new THREE.SphereGeometry(0.65, 24, 24);
    sphereGeo.scale(1.4, 0.9, 0.9);

    const ballMat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(this.color),
    });

    this.mesh = new THREE.Mesh(sphereGeo, ballMat);
    this.mesh.position.z = 0.4;
    this.group.add(this.mesh);

    // 2. Costura blanca central
    const seamGeo = new THREE.TorusGeometry(0.62, 0.04, 8, 32);
    const seamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const seam = new THREE.Mesh(seamGeo, seamMat);
    seam.rotation.y = Math.PI / 2;
    seam.position.z = 0.4;
    this.group.add(seam);

    // 3. Aro indicador de selección
    const selGeo = new THREE.RingGeometry(1.0, 1.25, 32);
    const selMat = new THREE.MeshBasicMaterial({
      color: 0x48cae4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.selectionRing = new THREE.Mesh(selGeo, selMat);
    this.selectionRing.position.z = 0.25;
    this.group.add(this.selectionRing);
  }

  setPosition(x, y) {
    this.group.position.set(x, y, 0);
  }

  getPosition() {
    return { x: this.group.position.x, y: this.group.position.y };
  }

  setSelected(selected) {
    this.isSelected = selected;
    if (this.isSelected) {
      this.selectionRing.material.opacity = 0.85;
    } else {
      this.selectionRing.material.opacity = 0.0;
    }
  }

  destroy() {
    this.scene.remove(this.group);
  }
}
