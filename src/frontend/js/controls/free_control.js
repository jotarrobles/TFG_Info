// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Módulo de Control Libre (Active Learning).
 * Permite pilotar un jugador en tiempo real con teclado (WASD/flechas) durante la simulación.
 */
class FreeControlManager {
  constructor(app) {
    this.app = app;
    this.isActive = false;
    this.controlledEntity = null;
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      ArrowUp: false,
      ArrowLeft: false,
      ArrowDown: false,
      ArrowRight: false,
    };
    this.speed = 7.5; // Velocidad de carrera del atleta en m/s
    this.controlledPosition = null; // Posición libre desacoplada

    this.initKeyboardListeners();
  }

  initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // Atajo 'C' para conmutar modo control libre
      if ((e.key === 'c' || e.key === 'C') && !this.isTypingInInput(e)) {
        this.toggle();
        return;
      }

      if (e.key in this.keys) {
        this.keys[e.key] = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key in this.keys) {
        this.keys[e.key] = false;
      }
    });
  }

  isTypingInInput(e) {
    const target = e.target;
    return target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
  }

  toggle() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  activate(targetEntity = null) {
    const entityToControl = targetEntity || this.app.selectedEntity;
    if (!entityToControl || entityToControl.role === 'ball') {
      alert('Por favor, selecciona primero un jugador en el campo para tomar el Control Libre.');
      return;
    }

    this.isActive = true;
    this.controlledEntity = entityToControl;
    this.controlledEntity.setControlled(true);

    const pos = this.controlledEntity.getPosition();
    this.controlledPosition = { x: pos.x, y: pos.y };

    // Actualizar UI
    const badge = document.getElementById('free-control-hud');
    if (badge) badge.classList.add('visible');

    const btn = document.getElementById('btn-toggle-free-control');
    if (btn) btn.classList.add('active');
  }

  deactivate() {
    if (this.controlledEntity) {
      this.controlledEntity.setControlled(false);
    }
    this.isActive = false;
    this.controlledEntity = null;
    this.controlledPosition = null;

    const badge = document.getElementById('free-control-hud');
    if (badge) badge.classList.remove('visible');

    const btn = document.getElementById('btn-toggle-free-control');
    if (btn) btn.classList.remove('active');
  }

  update(dt) {
    if (!this.isActive || !this.controlledEntity || !this.controlledPosition) {
      return;
    }

    // Calcular vector de dirección
    let moveX = 0;
    let moveY = 0;

    if (this.keys.w || this.keys.ArrowUp) moveY += 1;
    if (this.keys.s || this.keys.ArrowDown) moveY -= 1;
    if (this.keys.d || this.keys.ArrowRight) moveX += 1;
    if (this.keys.a || this.keys.ArrowLeft) moveX -= 1;

    // Normalizar vector diagonal para velocidad constante
    if (moveX !== 0 && moveY !== 0) {
      const invSqrt = 1.0 / Math.sqrt(2);
      moveX *= invSqrt;
      moveY *= invSqrt;
    }

    if (moveX !== 0 || moveY !== 0) {
      this.controlledPosition.x += moveX * this.speed * dt;
      this.controlledPosition.y += moveY * this.speed * dt;

      // Límites de campo reglamentario de rugby (-58m a +58m, -34m a +34m)
      this.controlledPosition.x = Math.max(-58, Math.min(58, this.controlledPosition.x));
      this.controlledPosition.y = Math.max(-34, Math.min(34, this.controlledPosition.y));

      this.controlledEntity.setPosition(this.controlledPosition.x, this.controlledPosition.y);

      // Si el atleta lleva el balón (o si el balón está asignado a él), trasladar el balón
      const ball = this.app.entities.find(e => e.role === 'ball');
      if (ball && ball.attachedTo === this.controlledEntity.id) {
        ball.setPosition(this.controlledPosition.x + 0.3, this.controlledPosition.y + 0.2);
      }
    }
  }
}
