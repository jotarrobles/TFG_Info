// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Motor cinemático de interpolación continua mediante Splines Catmull-Rom.
 * Transforma waypoints discretos en trayectorias suaves en el tiempo.
 */
class KinematicsEngine {
  constructor(scene) {
    this.scene = scene;
    this.trajectoryGroup = new THREE.Group();
    this.trajectoryGroup.name = 'trajectories-layer';
    this.scene.add(this.trajectoryGroup);
    
    this.curves = new Map(); // entityId -> { curve, waypoints, points }
  }

  clearTrajectories() {
    while (this.trajectoryGroup.children.length > 0) {
      const obj = this.trajectoryGroup.children[0];
      this.trajectoryGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }
    this.curves.clear();
  }

  updateEntityTrajectory(entity) {
    if (!entity || !entity.waypoints || entity.waypoints.length < 2) {
      return;
    }

    // Ordenar waypoints cronológicamente
    const wps = [...entity.waypoints].sort((a, b) => a.t - b.t);

    // Puntos 3D para Three.js CatmullRomCurve3
    const points3D = wps.map(w => new THREE.Vector3(w.x, w.y, 0.05));
    const curve = new THREE.CatmullRomCurve3(points3D, false, 'centripetal', 0.5);

    // Muestreo denso para dibujo visual suave
    const samplePoints = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(samplePoints);

    // Estilo según tipo de entidad (Pase discontinua, Carrera continua)
    const isBall = entity.role === 'ball';
    const matColor = new THREE.Color(entity.color || '#48CAE4');

    let material;
    if (isBall) {
      material = new THREE.LineDashedMaterial({
        color: matColor,
        dashSize: 1.0,
        gapSize: 0.8,
        linewidth: 2,
      });
    } else {
      material = new THREE.LineBasicMaterial({
        color: matColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
      });
    }

    const line = new THREE.Line(geometry, material);
    if (isBall) {
      line.computeLineDistances();
    }
    this.trajectoryGroup.add(line);

    // Añadir marcadores visuales para cada waypoint
    wps.forEach((wp, index) => {
      const dotGeo = new THREE.CircleGeometry(0.3, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: index === 0 ? 0x10b981 : (index === wps.length - 1 ? 0xef4444 : 0x48cae4),
        side: THREE.DoubleSide,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(wp.x, wp.y, 0.08);
      dot.userData = { type: 'waypoint', waypointId: wp.id, entityId: entity.id, index: index };
      this.trajectoryGroup.add(dot);
    });

    this.curves.set(entity.id, { curve, waypoints: wps });
  }

  evaluatePositionAtTime(entityId, time) {
    const data = this.curves.get(entityId);
    let result = null;

    if (!data || data.waypoints.length === 0) {
      return result;
    }

    const wps = data.waypoints;
    const firstWp = wps[0];
    const lastWp = wps[wps.length - 1];

    if (time <= firstWp.t) {
      result = { x: firstWp.x, y: firstWp.y };
      return result;
    }

    if (time >= lastWp.t) {
      result = { x: lastWp.x, y: lastWp.y };
      return result;
    }

    // Buscar el segmento exacto [t_i, t_{i+1}]
    for (let i = 0; i < wps.length - 1; i++) {
      const w0 = wps[i];
      const w1 = wps[i + 1];

      if (time >= w0.t && time <= w1.t) {
        const dt = w1.t - w0.t;
        const u = dt > 0 ? (time - w0.t) / dt : 0;

        // Interpolación suave Hermite cúbica (Smoothstep)
        const smoothU = u * u * (3 - 2 * u);
        const interpX = w0.x + (w1.x - w0.x) * smoothU;
        const interpY = w0.y + (w1.y - w0.y) * smoothU;

        result = { x: interpX, y: interpY };
        break;
      }
    }

    return result;
  }
}
