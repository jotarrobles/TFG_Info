// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Controlador de tiempo y reproducción de la simulación táctica.
 */
class TimelineController {
  constructor(duration = 10.0) {
    this.duration = duration;
    this.currentTime = 0.0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.isLooping = true;
    
    this.timeUpdateListeners = [];
    this.stateChangeListeners = [];
  }

  setDuration(duration) {
    this.duration = Math.max(1.0, duration);
    if (this.currentTime > this.duration) {
      this.currentTime = this.duration;
    }
    this.notifyTimeUpdate();
  }

  play() {
    if (!this.isPlaying) {
      if (this.currentTime >= this.duration) {
        this.currentTime = 0.0;
      }
      this.isPlaying = true;
      this.notifyStateChange();
    }
  }

  pause() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.notifyStateChange();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentTime = 0.0;
    this.notifyStateChange();
    this.notifyTimeUpdate();
  }

  seek(targetTime) {
    this.currentTime = Math.max(0.0, Math.min(targetTime, this.duration));
    this.notifyTimeUpdate();
  }

  setSpeed(speed) {
    this.playbackSpeed = speed;
    this.notifyStateChange();
  }

  update(dt) {
    if (!this.isPlaying) {
      return;
    }

    this.currentTime += dt * this.playbackSpeed;

    if (this.currentTime >= this.duration) {
      if (this.isLooping) {
        this.currentTime = 0.0;
      } else {
        this.currentTime = this.duration;
        this.isPlaying = false;
        this.notifyStateChange();
      }
    }

    this.notifyTimeUpdate();
  }

  onTimeUpdate(callback) {
    this.timeUpdateListeners.push(callback);
  }

  onStateChange(callback) {
    this.stateChangeListeners.push(callback);
  }

  notifyTimeUpdate() {
    for (let i = 0; i < this.timeUpdateListeners.length; i++) {
      this.timeUpdateListeners[i](this.currentTime, this.duration);
    }
  }

  notifyStateChange() {
    for (let i = 0; i < this.stateChangeListeners.length; i++) {
      this.stateChangeListeners[i]({
        isPlaying: this.isPlaying,
        speed: this.playbackSpeed,
        duration: this.duration,
      });
    }
  }
}
