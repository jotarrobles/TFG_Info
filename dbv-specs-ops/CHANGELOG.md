# Changelog — Pizarritas

All notable changes to **Pizarritas** will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Sin publicar] / [Unreleased]

### Added
- **Inicialización del proyecto y Metodología SDD:**
  - Bootstrap con framework `dbv-specs-ops` v2.8.0.
  - Especificaciones completas del MVP en `docs/SPECIFICATIONS.md` basadas en `especificacionInicial.md`.
  - Definición de arquitectura técnica Three.js + FastAPI en `docs/ARCHITECTURE.md`.
  - Sistema de diseño táctico deportivo en `docs/DESIGN.md`.
  - Licencia MIT, `.gitignore`, archivos de activación y `README.md`.
- **Implementación del MVP de Pizarritas:**
  - Backend FastAPI con esquemas Pydantic v2 y persistencia JSON de jugadas en `data/plays/`.
  - Generador métrico reglamentario del campo de rugby en Three.js con cámara ortográfica (1m = 1 unidad).
  - Fichas tácticas de jugadores con distinción entre Forwards y Backs, dorsales y balón de rugby.
  - Motor de interpolación cinemática continua con Splines Catmull-Rom y trazado de vectores.
  - Controlador de línea de tiempo con Play, Pause, Scrubbing interactivo y velocidades (0.5x, 1x, 2x).
  - Módulo de Control Libre (Active Learning) en tiempo real con teclado (WASD/flechas).
  - Cliente REST frontend para guardar, cargar y exportar/importar archivos `.json`.
  - Scripts de arranque y parada multiplataforma (`start.cmd`, `stop.cmd`, `start.sh`, `stop.sh`).
  - Suite de tests unitarios con `pytest` (100% aprobados).
