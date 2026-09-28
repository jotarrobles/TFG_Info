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

- [x] **Fase 2: Planificación (`/plan`)**
  - [x] Ejecutar Adversarial Architect Review (debate de edge cases y sincronización de control libre vs trayectorias de balón).
  - [x] Generar `dbv-specs-ops/implementation_plan.md` con desglose detallado de pasos atómicos.
  - [x] Aprobación del plan por parte del usuario.

- [x] **Fase 3: Construcción (`/build`)**
  - [x] Configuración del entorno Python (`venv`, `requirements.txt`, `pyproject.toml`) y estructura `src/`.
  - [x] Implementación de modelos Pydantic v2 (`src/backend/models/play.py`).
  - [x] Implementación de persistencia JSON y jugada reglamentaria de ejemplo (`src/backend/services/play_service.py`).
  - [x] Implementación de endpoints REST CRUD e importación/exportación (`src/backend/api/plays.py`).
  - [x] Punto de entrada FastAPI y servidor estático (`src/backend/main.py`).
  - [x] Motor Three.js con cámara ortográfica métrica (`src/frontend/js/engine/scene.js`).
  - [x] Terreno de juego oficial de Rugby con marcado reglamentario y zonas de ensayo (`src/frontend/js/pitch/rugby_pitch.js`).
  - [x] Fichas tácticas de jugadores con roles forwards/backs, dorsales y balón de rugby (`src/frontend/js/entities/`).
  - [x] Motor de cinemática continua con Splines Catmull-Rom (`src/frontend/js/animation/kinematics.js`).
  - [x] Controlador de línea de tiempo con Play, Pause, Scrubbing y velocidades (`src/frontend/js/animation/timeline.js`).
  - [x] Módulo de Control Libre en tiempo real con WASD/flechas (`src/frontend/js/controls/free_control.js`).
  - [x] Gestor de interacción con drag & drop y trazado de waypoints (`src/frontend/js/controls/interaction.js`).
  - [x] Cliente REST y exportación/importación JSON en cliente (`src/frontend/js/api/client.js`).
  - [x] Interfaz de usuario HUD deportiva tipo broadcast con CSS3 moderno (`src/frontend/index.html`, `src/frontend/css/style.css`).
  - [x] Scripts de ejecución multiplataforma (`start.cmd`, `start.sh`, `stop.cmd`, `stop.sh`).

- [x] **Fase 4: Pruebas (`/test`)**
  - [x] Tests unitarios y de integración de la API con `pytest` y `TestClient` (100% aprobados en `tests/backend/test_api.py`).
  - [x] Verificación de entrega de assets estáticos y endpoints HTTP (200 OK en HTML, CSS, JS y JSON).

- [x] **Fase 5: Simplificar y Revisar (`/code-simplify`)**
  - [x] Revisión por pases de `docs/REVIEW.md` (Bugs, Seguridad, Cumplimiento de estándares de código).
  - [x] Refactorización y hardening de seguridad: sanitización de rutas en `PlayService` para prevenir path traversal.

- [x] **Fase 6: Entrega (`/ship`)**
  - [x] Actualización de documentación final en `README.md` y `dbv-specs-ops/walkthrough.md`.
  - [x] Versionado semántico (v0.1.0 MVP) y publicación de `CHANGELOG.md`.
  - [x] Conexión de repositorio remoto `origin` a `https://github.com/jotarrobles/TFG_Info.git`.
  - [x] Creación de Git tag `v0.1.0`.

---

## 🔄 Context Snapshot / Snapshot de Contexto

> **Last update / Última actualización:** 2026-09-29
> **Exact point / Punto exacto:** Ciclo SDD completado al 100% (Spec → Plan → Build → Test → Simplify → Ship). Versión v0.1.0 (MVP) creada y etiquetada en Git.
> **Pending / Pendiente:** Subir la rama y los tags al repositorio remoto de GitHub (`git push -u origin main --tags`).
> **Next step / Próximo paso:** Ejecutar el comando sugerido para subir el proyecto a GitHub y continuar con las fases evolutivas del TFG según la hoja de ruta.
