# 🏗 Arquitectura Técnica: Pizarritas

> **Fase:** `/plan` (Planificación Técnica)
> **Estado:** Borrador Validado
> **Última Revisión:** 2026-09-28
> **Documento Origen:** `especificacionInicial.md` (Propuesta de TFG)

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Justificación |
| --- | --- | --- |
| **Backend** | Python 3.11+ / FastAPI | Framework asíncrono de alto rendimiento, autogeneración de OpenAPI, validación tipada con Pydantic v2. |
| **Validación de Datos** | Pydantic v2 | Garantiza esquemas JSON estrictos para jugadas, coordenadas, metadatos y trayectorias. |
| **Frontend / Motor Gráfico** | Three.js (WebGL) + JavaScript / HTML5 Canvas | Renderizado acelerado por hardware, gestión de cámara ortográfica 2D métrica, capacidad de interpolación de curvas (Catmull-Rom) y base preparada para 3D futuro. |
| **Interfaz de Usuario** | CSS3 Vanilla con diseño Dark Táctico | Control estético absoluto, sin dependencias pesadas, integración fluida con el canvas WebGL. |
| **Persistencia** | Almacenamiento JSON / SQLite | Sencillez de despliegue, portabilidad de jugadas y sin requisitos de infraestructura compleja para el MVP. |
| **Testing** | pytest (Backend) / Jest o Vitest (Frontend) | Ejecución rápida de tests deterministas para validación de endpoints y cálculos de interpolación. |

---

## 📂 Estructura de Directorios

```text
/
├── dbv-specs-ops/            # Framework Spec-Driven Development
│   ├── docs/                 # Documentación técnica (SPECIFICATIONS, ARCHITECTURE, DESIGN)
│   ├── memory.md             # Memoria cualitativa y registro ADR
│   ├── task.md               # Backlog operativo y snapshots
│   └── CHANGELOG.md          # Historial de versiones
├── src/
│   ├── backend/              # Servidor FastAPI
│   │   ├── api/              # Routers y endpoints REST (/plays, /export, /import)
│   │   ├── models/           # Esquemas Pydantic (Play, Entity, Waypoint, Trajectory)
│   │   ├── services/         # Lógica de almacenamiento, serialización y validación
│   │   └── main.py           # Punto de entrada de la aplicación FastAPI
│   └── frontend/             # Aplicación Web y Canvas Three.js
│       ├── css/              # Estilos visuales (tokens de DESIGN.md)
│       ├── js/
│       │   ├── engine/       # Motor Three.js (escena, cámara ortográfica, render loop)
│       │   ├── pitch/        # Generador del campo de rugby (marcas, 22m, try line, etc.)
│       │   ├── entities/     # Jugadores (backs, forwards), balón, dorsales y avatares
│       │   ├── animation/    # Interpolador Catmull-Rom, timeline, player de reproducción
│       │   ├── controls/     # Drag & drop (Raycasting), modo control libre (WASD/flechas)
│       │   └── api/          # Cliente HTTP para comunicación con FastAPI
│       └── index.html        # Página principal de la pizarra
├── tests/
│   ├── backend/              # Tests de endpoints y modelos Pydantic
│   └── frontend/             # Tests de lógica matemática y trayectorias
├── start.cmd                 # Script de arranque para Windows
├── start.sh                  # Script de arranque para Linux/macOS
├── stop.cmd                  # Script de parada para Windows
├── stop.sh                   # Script de parada para Linux/macOS
├── requirements.txt          # Dependencias Python (FastAPI, uvicorn, pydantic, pytest)
└── README.md                 # Documentación del proyecto
```

---

## 🔑 Decisiones Técnicas Clave (ADRs Iniciales)

### 1. Motor Gráfico: Three.js con Proyección Ortográfica
- **Decisión:** Emplear Three.js configurado con `THREE.OrthographicCamera` en lugar de un canvas 2D básico (CanvasRenderingContext2D).
- **Justificación:** 
  1. Permite cálculos vectoriales 3D nativos y curvas continuas (`CatmullRomCurve3`).
  2. Facilita la transición futura a la extensión 3D multicámara especificada en la Sección 5.1 del TFG sin reescribir la lógica espacial ni las estructuras de entidades.
  3. Proporciona aceleración por GPU para manejar múltiples entidades, vectores y capas a 60 FPS estables.

### 2. Estructura de Datos de Jugada (Play Schema JSON)
- **Decisión:** La jugada se serializa como un grafo temporal con lista de entidades (jugadores y balón) y colecciones ordenadas de `waypoints` con marca de tiempo relativa ($t$), velocidad deseada y acciones asociadas (pase, carrera, patada, ruck).
- **Esquema Pydantic:**
  - `Play`: `id`, `name`, `description`, `surface_type` (full, half, 22m, scrum, lineout), `duration`, `entities`.
  - `Entity`: `id`, `team` (attack/defense), `number`, `name`, `role` (forward/back/ball), `color`, `waypoints`.
  - `Waypoint`: `t` (segundos), `x`, `y` (metros en coordenadas de campo de rugby), `action`.

### 3. Modo de Control Libre (Active Learning)
- **Decisión:** Durante la reproducción de la simulación, un jugador activo puede ser "poseído" mediante un flag `is_user_controlled`.
- **Comportamiento:**
  - Se anula la evaluación de la curva spline para dicha entidad.
  - La posición se actualiza mediante un vector de velocidad derivado del input del usuario (WASD o teclado) normalizado por delta time.
  - Si el usuario suelta el control libre, la entidad se reconecta suavemente a la trayectoria interpolada o mantiene su posición actual según la configuración.

---

## 🤖 Agent Harness (Arnés del Agente)

### 1. Gestión de Contexto
- **Contexto Estático:** `GEMINI.md`, `ANTIGRAVITY.md`, `dbv-specs-ops/project.config.md`, `dbv-specs-ops/memory.md`.
- **Planificación:** Activación del modo Planning con desglose en `task.md` e `implementation_plan.md`.

### 2. Entorno de Ejecución (Sandboxing)
- **Python:** Entorno virtual aislado local (`venv/`) en la raíz del proyecto.
- **Frontend:** Archivos estáticos servidos directamente por FastAPI (`StaticFiles`) o servidor dev ligero, permitiendo testing unificado en un solo puerto (ej. `http://localhost:8000`).

### 3. Guardrails Deterministas de Seguridad
- No exponer credenciales ni tokens en código.
- Validación estricta de todos los payloads JSON recibidos en la API con Pydantic v2.
