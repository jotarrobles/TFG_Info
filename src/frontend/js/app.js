// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Coordinador principal de la aplicación Pizarritas.
 */
class PizarritasApp {
  constructor() {
    this.currentPlay = null;
    this.entities = []; // Array de instancias TacticalPlayer y TacticalBall
    this.selectedEntity = null;

    // Inicializar módulos
    this.api = new PizarritasApiClient();
    this.engine = new TacticalEngine('canvas-container');
    this.pitch = new RugbyPitch(this.engine.scene);
    this.kinematics = new KinematicsEngine(this.engine.scene);
    this.timeline = new TimelineController(10.0);
    this.freeControl = new FreeControlManager(this);
    this.interaction = new InteractionManager(this);

    this.initUI();
    this.initSimulationLoop();
    this.loadInitialPlay();
  }

  initUI() {
    // 1. Playback controls
    const btnPlay = document.getElementById('btn-play-pause');
    const btnStop = document.getElementById('btn-stop');
    const slider = document.getElementById('timeline-slider');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => this.timeline.togglePlay());
    }
    if (btnStop) {
      btnStop.addEventListener('click', () => this.timeline.stop());
    }
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.timeline.seek(val);
      });
    }

    // 2. Multiplicadores de velocidad
    document.querySelectorAll('.btn-speed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const speed = parseFloat(e.target.dataset.speed);
        this.timeline.setSpeed(speed);
        document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // 3. Control Libre
    const btnFreeCtrl = document.getElementById('btn-toggle-free-control');
    if (btnFreeCtrl) {
      btnFreeCtrl.addEventListener('click', () => this.freeControl.toggle());
    }

    // 4. Herramientas de añadir entidades
    const btnAddAttacker = document.getElementById('tool-add-attacker');
    const btnAddDefender = document.getElementById('tool-add-defender');
    const btnAddBall = document.getElementById('tool-add-ball');

    if (btnAddAttacker) {
      btnAddAttacker.addEventListener('click', () => this.createPlayer('attack'));
    }
    if (btnAddDefender) {
      btnAddDefender.addEventListener('click', () => this.createPlayer('defense'));
    }
    if (btnAddBall) {
      btnAddBall.addEventListener('click', () => this.createBall());
    }

    // 5. Selector de herramientas
    const btnToolSelect = document.getElementById('tool-select');
    const btnToolWp = document.getElementById('tool-add-waypoint');
    if (btnToolSelect) {
      btnToolSelect.addEventListener('click', () => this.interaction.setTool('select'));
    }
    if (btnToolWp) {
      btnToolWp.addEventListener('click', () => this.interaction.setTool('add_waypoint'));
    }

    // 6. Encuadres de cámara (Framing)
    const selectFraming = document.getElementById('select-framing');
    if (selectFraming) {
      selectFraming.addEventListener('change', (e) => {
        this.engine.setFraming(e.target.value);
        if (this.currentPlay) {
          this.currentPlay.surface_type = e.target.value;
        }
      });
    }

    // 7. Guardar, Cargar y Exportar
    const btnSave = document.getElementById('btn-save-play');
    const btnNew = document.getElementById('btn-new-play');
    const btnExport = document.getElementById('btn-export-json');
    const inputImport = document.getElementById('file-import-json');
    const selectPlay = document.getElementById('select-saved-plays');

    if (btnSave) {
      btnSave.addEventListener('click', () => this.saveCurrentPlay());
    }
    if (btnNew) {
      btnNew.addEventListener('click', () => this.newPlay());
    }
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportCurrentPlay());
    }
    if (inputImport) {
      inputImport.addEventListener('change', (e) => this.handleFileImport(e));
    }
    if (selectPlay) {
      selectPlay.addEventListener('change', (e) => this.loadPlayById(e.target.value));
    }

    // 8. Inspector de Entidad Form inputs
    this.initInspectorListeners();

    // 9. Modal de ayuda
    const btnHelp = document.getElementById('btn-help');
    const modalHelp = document.getElementById('modal-shortcuts');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (btnHelp && modalHelp) {
      btnHelp.addEventListener('click', () => modalHelp.classList.add('active'));
    }
    if (btnCloseModal && modalHelp) {
      btnCloseModal.addEventListener('click', () => modalHelp.classList.remove('active'));
    }

    // 10. Actualización de UI desde Timeline
    this.timeline.onTimeUpdate((currentTime, duration) => {
      const timeDisplay = document.getElementById('time-display');
      const timeSlider = document.getElementById('timeline-slider');
      if (timeDisplay) {
        timeDisplay.textContent = `${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s`;
      }
      if (timeSlider) {
        timeSlider.max = duration;
        timeSlider.value = currentTime;
      }
    });

    this.timeline.onStateChange((state) => {
      const playIcon = document.getElementById('play-icon');
      if (playIcon) {
        playIcon.textContent = state.isPlaying ? '⏸' : '▶';
      }
    });
  }

  initInspectorListeners() {
    const inputName = document.getElementById('prop-name');
    const inputNumber = document.getElementById('prop-number');
    const selectRole = document.getElementById('prop-role');
    const selectTeam = document.getElementById('prop-team');
    const inputColor = document.getElementById('prop-color');
    const btnDelete = document.getElementById('btn-delete-entity');

    const updateEntityFromForm = () => {
      if (!this.selectedEntity) return;
      this.selectedEntity.updateData({
        name: inputName ? inputName.value : undefined,
        number: inputNumber ? parseInt(inputNumber.value, 10) : undefined,
        role: selectRole ? selectRole.value : undefined,
        team: selectTeam ? selectTeam.value : undefined,
        color: inputColor ? inputColor.value : undefined,
      });
      this.updateTrajectories();
    };

    if (inputName) inputName.addEventListener('input', updateEntityFromForm);
    if (inputNumber) inputNumber.addEventListener('input', updateEntityFromForm);
    if (selectRole) selectRole.addEventListener('change', updateEntityFromForm);
    if (selectTeam) selectTeam.addEventListener('change', updateEntityFromForm);
    if (inputColor) inputColor.addEventListener('input', updateEntityFromForm);
    if (btnDelete) {
      btnDelete.addEventListener('click', () => this.deleteSelectedEntity());
    }
  }

  initSimulationLoop() {
    this.engine.onUpdate((dt) => {
      // 1. Avanzar reloj de simulación
      this.timeline.update(dt);

      // 2. Si está en modo control libre, actualizar entidad controlada
      if (this.freeControl.isActive) {
        this.freeControl.update(dt);
      }

      // 3. Evaluar cinemática para todas las entidades
      const t = this.timeline.currentTime;
      this.entities.forEach(entity => {
        // Si esta entidad está siendo pilotada por control libre, no sobreescribir con spline
        if (this.freeControl.isActive && this.freeControl.controlledEntity === entity) {
          return;
        }

        const evaluatedPos = this.kinematics.evaluatePositionAtTime(entity.id, t);
        if (evaluatedPos) {
          entity.setPosition(evaluatedPos.x, evaluatedPos.y);
        }
      });
    });
  }

  async loadInitialPlay() {
    const plays = await this.api.listPlays();
    this.updatePlayDropdown(plays);

    if (plays.length > 0) {
      const fullPlay = await this.api.getPlay(plays[0].id);
      if (fullPlay) {
        this.renderPlay(fullPlay);
      }
    } else {
      this.newPlay();
    }
  }

  updatePlayDropdown(plays) {
    const select = document.getElementById('select-saved-plays');
    if (!select) return;

    select.innerHTML = '<option value="">Cargar jugada...</option>';
    plays.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} (${p.duration}s)`;
      select.appendChild(opt);
    });
  }

  renderPlay(playData) {
    // 1. Limpiar entidades existentes
    this.clearAllEntities();

    this.currentPlay = playData;
    this.timeline.setDuration(playData.duration || 10.0);

    // 2. Establecer encuadre de campo
    const selectFraming = document.getElementById('select-framing');
    if (selectFraming && playData.surface_type) {
      selectFraming.value = playData.surface_type;
      this.engine.setFraming(playData.surface_type);
    }

    // 3. Crear instancias de entidades
    if (playData.entities && playData.entities.length > 0) {
      playData.entities.forEach(eData => {
        if (eData.role === 'ball') {
          const ball = new TacticalBall(eData, this.engine.scene);
          this.entities.push(ball);
        } else {
          const player = new TacticalPlayer(eData, this.engine.scene);
          this.entities.push(player);
        }
      });
    }

    // 4. Actualizar trayectorias visuales
    this.updateTrajectories();

    // 5. Actualizar título en HUD
    const titleInput = document.getElementById('play-name-input');
    if (titleInput) {
      titleInput.value = playData.name || 'Nueva Jugada';
    }
  }

  clearAllEntities() {
    this.entities.forEach(e => e.destroy());
    this.entities = [];
    this.selectEntity(null);
    this.kinematics.clearTrajectories();
  }

  updateTrajectories() {
    this.kinematics.clearTrajectories();
    this.entities.forEach(e => {
      this.kinematics.updateEntityTrajectory(e);
    });
  }

  selectEntity(entity) {
    if (this.selectedEntity) {
      this.selectedEntity.setSelected(false);
    }

    this.selectedEntity = entity;
    if (this.selectedEntity) {
      this.selectedEntity.setSelected(true);
    }

    this.refreshInspector();
  }

  refreshInspector() {
    const inspector = document.getElementById('entity-inspector-box');
    const noSelectionMsg = document.getElementById('no-selection-msg');

    if (!this.selectedEntity) {
      if (inspector) inspector.style.display = 'none';
      if (noSelectionMsg) noSelectionMsg.style.display = 'block';
      return;
    }

    if (inspector) inspector.style.display = 'flex';
    if (noSelectionMsg) noSelectionMsg.style.display = 'none';

    const inputName = document.getElementById('prop-name');
    const inputNumber = document.getElementById('prop-number');
    const selectRole = document.getElementById('prop-role');
    const selectTeam = document.getElementById('prop-team');
    const inputColor = document.getElementById('prop-color');
    const wpCountBadge = document.getElementById('prop-wp-count');

    if (inputName) inputName.value = this.selectedEntity.name;
    if (inputNumber) inputNumber.value = this.selectedEntity.number;
    if (selectRole) selectRole.value = this.selectedEntity.role;
    if (selectTeam) selectTeam.value = this.selectedEntity.team;
    if (inputColor) inputColor.value = this.selectedEntity.color;
    if (wpCountBadge) {
      wpCountBadge.textContent = `${this.selectedEntity.waypoints ? this.selectedEntity.waypoints.length : 0} waypoints`;
    }
  }

  createPlayer(team = 'attack') {
    const isAttack = team === 'attack';
    const existingOfTeam = this.entities.filter(e => e.team === team && e.role !== 'ball');
    const nextNumber = existingOfTeam.length + (isAttack ? 1 : 1);

    const newPlayerData = {
      id: `p-${Date.now()}`,
      number: nextNumber <= 15 ? nextNumber : Math.floor(Math.random() * 80 + 20),
      name: `${isAttack ? 'Atacante' : 'Defensor'} ${nextNumber}`,
      role: nextNumber <= 8 ? 'forward' : 'back',
      team: team,
      color: isAttack ? '#E63946' : '#1D3557',
      metadata_label: nextNumber <= 8 ? 'Forward' : 'Back',
      waypoints: [
        {
          id: `wp-${Date.now()}-1`,
          t: 0.0,
          x: isAttack ? -5.0 + Math.random() * 5 : 5.0 + Math.random() * 5,
          y: (Math.random() - 0.5) * 20,
          action: 'run',
          speed: 5.0
        }
      ]
    };

    const player = new TacticalPlayer(newPlayerData, this.engine.scene);
    this.entities.push(player);
    this.selectEntity(player);
    this.updateTrajectories();
  }

  createBall() {
    const existingBall = this.entities.find(e => e.role === 'ball');
    if (existingBall) {
      this.selectEntity(existingBall);
      return;
    }

    const ballData = {
      id: `ball-${Date.now()}`,
      number: 0,
      name: 'Balón',
      role: 'ball',
      team: 'neutral',
      color: '#E9C46A',
      waypoints: [
        { id: `wp-b-1`, t: 0.0, x: 0.0, y: 0.0, action: 'run', speed: 4.0 }
      ]
    };

    const ball = new TacticalBall(ballData, this.engine.scene);
    this.entities.push(ball);
    this.selectEntity(ball);
    this.updateTrajectories();
  }

  deleteSelectedEntity() {
    if (!this.selectedEntity) return;

    if (this.freeControl.controlledEntity === this.selectedEntity) {
      this.freeControl.deactivate();
    }

    const index = this.entities.indexOf(this.selectedEntity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }

    this.selectedEntity.destroy();
    this.selectEntity(null);
    this.updateTrajectories();
  }

  async saveCurrentPlay() {
    const titleInput = document.getElementById('play-name-input');
    const playName = titleInput ? titleInput.value.trim() : 'Jugada Táctica';
    const framingSelect = document.getElementById('select-framing');

    const playPayload = {
      id: this.currentPlay ? this.currentPlay.id : `play-${Date.now()}`,
      name: playName || 'Jugada de Rugby',
      description: this.currentPlay ? this.currentPlay.description : '',
      surface_type: framingSelect ? framingSelect.value : 'full_pitch',
      duration: this.timeline.duration,
      entities: this.entities.map(e => ({
        id: e.id,
        number: e.number,
        name: e.name,
        role: e.role,
        team: e.team,
        color: e.color,
        metadata_label: e.metadataLabel,
        waypoints: e.waypoints,
        is_active: true
      }))
    };

    try {
      const saved = await this.api.savePlay(playPayload);
      this.currentPlay = saved;
      alert(`¡Jugada '${saved.name}' guardada correctamente en el backend!`);

      const plays = await this.api.listPlays();
      this.updatePlayDropdown(plays);
    } catch (err) {
      alert('Error al guardar la jugada: ' + err.message);
    }
  }

  newPlay() {
    const freshPlay = {
      id: `play-${Date.now()}`,
      name: 'Nueva Pizarra Táctica',
      description: '',
      surface_type: 'full_pitch',
      duration: 10.0,
      entities: []
    };
    this.renderPlay(freshPlay);
  }

  async loadPlayById(playId) {
    if (!playId) return;
    const play = await this.api.getPlay(playId);
    if (play) {
      this.renderPlay(play);
    }
  }

  exportCurrentPlay() {
    if (!this.currentPlay) {
      this.saveCurrentPlay();
    }
    const dataToExport = {
      id: this.currentPlay.id,
      name: this.currentPlay.name,
      description: this.currentPlay.description,
      surface_type: this.currentPlay.surface_type,
      duration: this.timeline.duration,
      entities: this.entities.map(e => ({
        id: e.id,
        number: e.number,
        name: e.name,
        role: e.role,
        team: e.team,
        color: e.color,
        metadata_label: e.metadataLabel,
        waypoints: e.waypoints,
        is_active: true
      }))
    };
    this.api.exportToJsonFile(dataToExport);
  }

  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = await this.api.importFromJson(event.target.result);
        this.renderPlay(imported);
        alert(`¡Jugada '${imported.name}' importada y validada con éxito!`);
        const plays = await this.api.listPlays();
        this.updatePlayDropdown(plays);
      } catch (err) {
        alert('Error en importación: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
}

// Iniciar aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  window.app = new PizarritasApp();
});
