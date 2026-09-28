# 🧠 Memory & Context: Pizarritas

> **Frontera de uso (Memory vs. Tasks):**
> - `task.md` → progreso **operativo**: checklist de tareas, Snapshot de Contexto (el paso exacto siguiente), y estado de la sesión.
> - `memory.md` → contexto **cualitativo y temático**: conocimiento persistente, decisiones técnicas profundas, lecciones y el área del producto en foco.
>
> *Instrucción para la IA: Consulta este archivo al inicio de cada sesión para recuperar el hilo técnico.*

---

## 🎯 Contexto Activo

- **Proyecto:** Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby (TFG).
- **Estado actual del desarrollo:** Fase `/spec` completada y validada a partir de `especificacionInicial.md`. Listos para avanzar a `/plan` (Planificación del MVP).
- **Foco inmediato:** Validar la arquitectura y desglosar el plan de implementación del MVP en `task.md` y `implementation_plan.md`.

---

## 🏗️ Log de Decisiones Técnicas (ADR Ligero)

- **2026-09-28 - Motor de Renderizado (Three.js OrthographicCamera):** Se selecciona Three.js con cámara ortográfica para la vista cenital 2D de la pizarra. Permite precisión métrica sin distorsión de perspectiva, soporte nativo de interpolación continua mediante `THREE.CatmullRomCurve3` y sienta las bases técnicas para la futura extensión 3D multicámara especificada en la propuesta del TFG sin reescribir el motor.
- **2026-09-28 - Backend Asíncrono en FastAPI:** Se selecciona FastAPI (Python 3.11+) con Pydantic v2 para gestionar la persistencia y exportación de jugadas tácticas mediante esquemas JSON estructurados. Permite validación estricta de coordenadas, entidades y líneas de tiempo, ofreciendo una API REST rápida y ligera.
- **2026-09-28 - Desacoplamiento en Modo Control Libre:** La simulación permite que un atleta sea desvinculado de su trayectoria interpolada para ser controlado en tiempo real (teclado/WASD) mientras el resto de entidades mantiene su ejecución cinemática autónoma, logrando el objetivo pedagógico de aprendizaje activo.

---

## ⚠️ Lecciones Aprendidas / Errores Evitados

- **[Coordenadas Métricas del Campo]:** Las dimensiones oficiales de un campo de rugby (100m entre líneas de try + 10-22m de in-goal y 70m de ancho) deben modelarse con escala métrica 1 unidad Three.js = 1 metro real para que las velocidades (m/s) e interpolaciones cinemáticas sean realistas.
- **[Aislamiento del Framework]:** Todo el control metodológico reside dentro de `dbv-specs-ops/`, manteniendo la raíz del repositorio limpia y enfocada en el código fuente de la aplicación (`src/`, `tests/`, etc.).

---

## 🗺️ Mapa de Relaciones

- `src/backend/main.py`: Punto de entrada de FastAPI y servicio de archivos estáticos.
- `src/backend/api/plays.py`: Endpoints REST para CRUD, importación y exportación de jugadas tácticas.
- `src/backend/models/play.py`: Esquemas Pydantic v2 de jugada, jugadores, waypoints y acciones.
- `src/frontend/js/engine/`: Inicialización de Three.js, escena, cámara ortográfica y loop de animación.
- `src/frontend/js/pitch/`: Renderizado geométrico reglamentario del campo de rugby y encuadres.
- `src/frontend/js/animation/`: Interpolador de curvas splines y controlador de reproducción temporal.
- `src/frontend/js/controls/`: Drag-and-drop de nodos y módulo de control libre en tiempo real.
