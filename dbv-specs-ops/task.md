# Backlog - Pizarritas (Software de Diseño, Animación y Simulación Táctica de Rugby)

## Contexto del Proyecto (Context Snapshot)
* **Objetivo:** Desarrollar el MVP de **Pizarritas** combinando una pizarra táctica cenital con Three.js (WebGL), animación continua cinemática (splines), modo de control libre interactivo y backend de persistencia con FastAPI.
* **Estado actual:** Fase `/spec` completada y validada. Preparando el pase a `/plan` para el desglose técnico y aprobación del plan de implementación.
* **Última decisión técnica:** Selección de Three.js (OrthographicCamera) en frontend y FastAPI con Pydantic v2 en backend.
* **Próximo paso:** Ejecutar `/plan` (Adversarial Architect Review y desglose de tareas atómicas del MVP).

---

## Checklist de Tareas

- [x] **Bootstrap e Inicialización del Framework SDD (`dbv-specs-ops v2.8.0`)**
  - [x] Estructuración de `dbv-specs-ops/` y archivos de activación en raíz (`GEMINI.md`, `ANTIGRAVITY.md`, `CLAUDE.md`, `.windsurfrules`, `.github/copilot-instructions.md`).
  - [x] Configuración de `project.config.md` (Pizarritas, MIT, Juan Robles Angulo, Three.js + FastAPI).
  - [x] Creación de `LICENSE`, `.gitignore` y `README.md` bilingüe en la raíz.
  - [x] Repositorio Git inicializado con primer commit.

- [x] **Fase 1: Especificación (`/spec`)**
  - [x] Análisis completo de la propuesta de TFG `especificacionInicial.md`.
  - [x] Redacción de `dbv-specs-ops/docs/SPECIFICATIONS.md` con requisitos funcionales del MVP (REQ-1 a REQ-6) y delimitación fuera de alcance.
  - [x] Redacción de `dbv-specs-ops/docs/ARCHITECTURE.md` con arquitectura Three.js + FastAPI y estructura de directorios.
  - [x] Redacción de `dbv-specs-ops/docs/DESIGN.md` con tokens de diseño visual, colores de campo de rugby y componentes HUD.
  - [x] Actualización de `dbv-specs-ops/memory.md`.

- [ ] **Fase 2: Planificación (`/plan`)**
  - [ ] Ejecutar Adversarial Architect Review (debate de edge cases y riesgos en rugby y Three.js).
  - [ ] Generar `dbv-specs-ops/implementation_plan.md` con desglose detallado de pasos atómicos.
  - [ ] Aprobación del plan por parte del usuario.

- [ ] **Fase 3: Construcción (`/build`)**
  - [ ] Configuración del entorno Python (`venv`, `requirements.txt`) y estructura de carpetas `src/`.
  - [ ] Implementación de modelos Pydantic v2 y endpoints CRUD en FastAPI (`src/backend/`).
  - [ ] Implementación del motor Three.js con proyección ortográfica y césped reglamentario de rugby (`src/frontend/`).
  - [ ] Implementación de entidades tácticas (jugadores atacantes/defensores con roles, dorsales y balón).
  - [ ] Módulo de trazado vectorial y edición de waypoints interactivos (drag & drop).
  - [ ] Motor de interpolación cinemática continua (splines) y controlador de línea de tiempo (Play/Pause/Scrub).
  - [ ] Módulo de Control Libre interactivo (WASD/flechas) para aprendizaje motor activo.
  - [ ] Conexión frontend-backend para guardar, cargar y exportar jugadas en JSON.
  - [ ] Scripts de arranque multiplataforma (`start.cmd`, `start.sh`, `stop.cmd`, `stop.sh`).

- [ ] **Fase 4: Pruebas (`/test`)**
  - [ ] Tests unitarios y de integración en backend con `pytest` (validación de modelos Pydantic y endpoints de jugadas).
  - [ ] Tests de cálculo de interpolación matemática de trayectorias.

- [ ] **Fase 5: Simplificar y Revisar (`/code-simplify`)**
  - [ ] Revisión por pases de `docs/REVIEW.md` (Bugs, Seguridad, Cumplimiento de estándares de código).
  - [ ] Refactorización para máxima claridad y legibilidad.

- [ ] **Fase 6: Entrega (`/ship`)**
  - [ ] Actualización de documentación final en `README.md` y `dbv-specs-ops/walkthrough.md`.
  - [ ] Versionado semántico (v0.1.0 MVP) y actualización de `CHANGELOG.md`.
  - [ ] Propuesta de commit y git tag.

---

## 🔄 Context Snapshot / Snapshot de Contexto

> **Last update / Última actualización:** 2026-09-28
> **Exact point / Punto exacto:** Bootstrap y Fase `/spec` completadas con éxito. Especificaciones, arquitectura y sistema de diseño documentados.
> **Pending / Pendiente:** Iniciar la Fase `/plan` con el Adversarial Architect Review y la generación de `implementation_plan.md`.
> **Next step / Próximo paso:** Ejecutar `/plan` y solicitar confirmación del plan de implementación al usuario.
