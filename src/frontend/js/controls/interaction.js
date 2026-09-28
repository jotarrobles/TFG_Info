// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Gestor de interacción con el puntero: selección, arrastre (drag & drop) y edición de waypoints.
 */
class InteractionManager {
  constructor(app) {
    this.app = app;
    this.engine = app.engine;
    this.currentTool = 'select'; // 'select', 'add_waypoint'
    
    this.isDragging = false;
    this.draggedObject = null; // { type: 'entity' | 'waypoint', target, waypointIndex }
    this.pointerDownPos = { x: 0, y: 0 };

    this.initListeners();
  }

  setTool(tool) {
    this.currentTool = tool;
    const btnSelect = document.getElementById('tool-select');
    const btnAddWp = document.getElementById('tool-add-waypoint');

    if (btnSelect) btnSelect.classList.toggle('active', tool === 'select');
    if (btnAddWp) btnAddWp.classList.toggle('active', tool === 'add_waypoint');
  }

  initListeners() {
    const dom = this.engine.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    dom.addEventListener('pointermove', (e) => this.onPointerMove(e));
    dom.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // Tecla Supr / Backspace para borrar entidad seleccionada
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !this.isTypingInInput(e)) {
        if (this.app.selectedEntity) {
          this.app.deleteSelectedEntity();
        }
      }
    });
  }

  isTypingInInput(e) {
    const target = e.target;
    return target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
  }

  onPointerDown(e) {
    if (e.button !== 0) return; // Solo clic primario

    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    const worldPoint = this.engine.screenToWorld(e.clientX, e.clientY);
    if (!worldPoint) return;

    // Buscar si hicimos clic sobre alguna entidad táctica o waypoint
    this.engine.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.engine.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.engine.raycaster.setFromCamera(this.engine.mouse, this.engine.camera);

    const hitEntities = [];
    this.app.entities.forEach(entity => {
      const hits = this.engine.raycaster.intersectObjects(entity.group.children, true);
      if (hits.length > 0) {
        hitEntities.push(entity);
      }
    });

    if (hitEntities.length > 0) {
      const clickedEntity = hitEntities[0];
      this.app.selectEntity(clickedEntity);
      this.isDragging = true;
      this.draggedObject = { type: 'entity', target: clickedEntity };
      return;
    }

    // Si estamos en herramienta de añadir waypoint y tenemos un jugador seleccionado
    if (this.currentTool === 'add_waypoint' && this.app.selectedEntity) {
      this.addWaypointToSelected(worldPoint.x, worldPoint.y);
      return;
    }

    // Si se hace clic en el terreno vacío, deseleccionar
    this.app.selectEntity(null);
  }

  onPointerMove(e) {
    if (!this.isDragging || !this.draggedObject) return;

    const worldPoint = this.engine.screenToWorld(e.clientX, e.clientY);
    if (!worldPoint) return;

    // Mover la entidad arrastrada
    if (this.draggedObject.type === 'entity') {
      const entity = this.draggedObject.target;
      entity.setPosition(worldPoint.x, worldPoint.y);

      // Si la simulación está parada en t=0, actualizar o crear el primer waypoint
      if (this.app.timeline.currentTime === 0.0) {
        if (entity.waypoints.length === 0) {
          entity.waypoints.push({
            id: `wp-${Date.now()}`,
            t: 0.0,
            x: worldPoint.x,
            y: worldPoint.y,
            action: 'run',
            speed: 5.0
          });
        } else {
          entity.waypoints[0].x = worldPoint.x;
          entity.waypoints[0].y = worldPoint.y;
        }
        this.app.updateTrajectories();
      }
    }
  }

  onPointerUp(e) {
    this.isDragging = false;
    this.draggedObject = null;
  }

  addWaypointToSelected(x, y) {
    const entity = this.app.selectedEntity;
    if (!entity) return;

    const lastWp = entity.waypoints.length > 0
      ? entity.waypoints[entity.waypoints.length - 1]
      : { t: 0.0, x: entity.getPosition().x, y: entity.getPosition().y };

    // Estimar tiempo según distancia y velocidad media (5 m/s)
    const dist = Math.hypot(x - lastWp.x, y - lastWp.y);
    const dt = Math.max(0.5, dist / 5.0);
    const newT = Math.round((lastWp.t + dt) * 10) / 10;

    const newWp = {
      id: `wp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      t: newT,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      action: entity.role === 'ball' ? 'pass' : 'run',
      speed: 5.0
    };

    entity.waypoints.push(newWp);
    entity.waypoints.sort((a, b) => a.t - b.t);

    // Ajustar duración total de la jugada si supera la actual
    if (newT > this.app.timeline.duration) {
      this.app.timeline.setDuration(newT + 1.0);
      const durInput = document.getElementById('prop-play-duration');
      if (durInput) durInput.value = this.app.timeline.duration;
    }

    this.app.updateTrajectories();
    this.app.refreshInspector();
  }
}
