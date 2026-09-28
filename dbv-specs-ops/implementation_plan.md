---
dependencies:
  - python >= 3.11
  - fastapi >= 0.110.0
  - uvicorn >= 0.28.0
  - pydantic >= 2.6.0
  - pytest >= 8.0.0
  - httpx >= 0.27.0
  - three.js >= 0.160.0
risks:
  - Sincronización temporal entre simulación y modo control libre
  - Renderizado métrico preciso de las marcas reglamentarias del campo de rugby (ensayo, 22m, 10m, 5m, 15m, in-goal)
  - Precisión del drag and drop con proyección ortográfica y raycasting en Three.js
rollback_strategy:
  - Cada fase y paso atómico se validará y comiteará en Git independientemente
  - Desacoplamiento estricto entre API REST backend y cliente frontend estático
---

# 📋 Plan de Implementación: Pizarritas (MVP)

> **Proyecto:** Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby (TFG)
> **Fase:** `/plan` (Planificación Técnica)
> **Autor:** Juan Robles Angulo
> **Fecha:** 2026-09-28
> **Estado:** Pendiente de Aprobación

---

## 🎯 Resumen Ejecutivo

El objetivo de este plan es construir el **Producto Mínimo Viable (MVP)** de **Pizarritas** conforme a los requisitos establecidos en `SPECIFICATIONS.md` y `especificacionInicial.md`:
1. **Lienzo táctico cenital métrico (Three.js)** con cámara ortográfica y marcas reglamentarias de rugby.
2. **Entidades personalizadas** (jugadores forwards/backs, balón, dorsales y equipos ataque/defensa).
3. **Editor vectorial de trayectorias** con waypoints interactivos (drag & drop).
4. **Motor de animación e interpolación cinemática continua** (splines Catmull-Rom) con controles de reproducción (Play/Pause/Scrub).
5. **Módulo de Control Libre en tiempo real** (conducción activa con WASD/flechas de un atleta mientras el resto ejecuta su plan).
6. **Backend FastAPI y Persistencia JSON** con esquemas tipados Pydantic v2 para guardar, listar y exportar jugadas.
7. **Scripts multiplataforma** de arranque y parada (`start.cmd`, `start.sh`).

---

## 🛠 Desglose Atómico de Tareas por Fases

### Fase 1: Arquitectura Backend y Modelos de Datos (FastAPI)
- [ ] **Paso 1.1:** Configurar `requirements.txt` con FastAPI, Uvicorn, Pydantic v2, Pytest y HTTPX.
- [ ] **Paso 1.2:** Implementar modelos Pydantic en `src/backend/models/play.py`:
  - `ActionType`: RUN, PASS, KICK, RUCK.
  - `Waypoint`: tiempo $t$, coordenadas métricas $(x, y)$, acción y velocidad.
  - `EntityRole`: FORWARD, BACK, BALL.
  - `TeamType`: ATTACK, DEFENSE, NEUTRAL.
  - `Entity`: ID, nombre, dorsal, rol, equipo, color, lista de waypoints.
  - `SurfaceType`: FULL_PITCH, HALF_PITCH, TWENTY_TWO, SCRUM, LINEOUT.
  - `Play`: ID, nombre, descripción, superficie, duración, lista de entidades y metadatos.
- [ ] **Paso 1.3:** Implementar el servicio de almacenamiento y gestión de jugadas `src/backend/services/play_service.py` (almacenamiento en ficheros JSON en directorio `data/plays/` con jugada de ejemplo por defecto).
- [ ] **Paso 1.4:** Implementar el router de API REST `src/backend/api/plays.py`:
  - `GET /api/plays`: Lista de jugadas guardadas.
  - `GET /api/plays/{id}`: Detalle de una jugada específica.
  - `POST /api/plays`: Guardar/crear nueva jugada con validación Pydantic.
  - `PUT /api/plays/{id}`: Actualizar jugada existente.
  - `DELETE /api/plays/{id}`: Eliminar jugada.
  - `POST /api/plays/import`: Importar JSON estructurado.
- [ ] **Paso 1.5:** Configurar `src/backend/main.py` montando la API y el servicio de archivos estáticos para la interfaz frontend.
- [ ] **Paso 1.6:** Escribir tests unitarios con `pytest` en `tests/backend/test_api.py` verificando validación y endpoints.

---

### Fase 2: Terreno de Rugby Reglamentario y Motor Gráfico (Three.js)
- [ ] **Paso 2.1:** Crear la estructura de la aplicación web:
  - `src/frontend/index.html`: Estructura semántica con barra superior HUD, lienzo WebGL central, panel lateral colapsable y barra de control de tiempo inferior.
  - `src/frontend/css/style.css`: Estilos basados en los tokens de `docs/DESIGN.md` (Dark Theme deportivo, glassmorphism, tipografía Inter).
- [ ] **Paso 2.2:** Implementar `src/frontend/js/engine/scene.js`:
  - Inicialización de `THREE.Scene`, `THREE.OrthographicCamera` y `THREE.WebGLRenderer`.
  - Configuración de escala métrica (1 unidad = 1 metro).
  - Bucle de renderizado desacoplado con delta time para física cinemática constante a 60 FPS.
  - Gestión de resize responsivo manteniendo la relación de aspecto.
- [ ] **Paso 2.3:** Implementar `src/frontend/js/pitch/rugby_pitch.js`:
  - Geometría precisa del campo de rugby: 100m de campo de juego, 70m de ancho, in-goals de 10m.
  - Trazado de líneas reglamentarias: líneas de ensayo, líneas de 22m, línea de medio campo (50m), líneas discontinuas de 10m, líneas discontinuas de 5m y 15m.
  - Selección de encuadres de cámara ortográfica: Campo completo, Medio campo, Zona 22m, Set-piece (Scrum/Lineout).

---

### Fase 3: Entidades Tácticas y Editor Vectorial de Waypoints
- [ ] **Paso 3.1:** Implementar `src/frontend/js/entities/player.js` y `src/frontend/js/entities/ball.js`:
  - Renderizado de fichas circulares con CanvasTexture para dorsales tipográficos de alto contraste.
  - Identificación cromática: Ataque (`#E63946`), Defensa (`#1D3557`), Balón ovalado cuero (`#E9C46A`).
  - Distinción visual entre forwards (1-8) y backs (9-15) y etiquetas de metadatos.
- [ ] **Paso 3.2:** Implementar `src/frontend/js/controls/interaction.js`:
  - Raycaster para selección de jugadores y waypoints con eventos de puntero (drag & drop).
  - Herramienta para añadir nuevos waypoints haciendo clic en el campo.
  - Trazado dinámico de vectores en el campo (línea continua para carrera, discontinua para pase).

---

### Fase 4: Motor de Animación Cinemática e Interpolación Spline
- [ ] **Paso 4.1:** Implementar `src/frontend/js/animation/kinematics.js`:
  - Construcción de curvas `THREE.CatmullRomCurve3` continuas a través de los waypoints.
  - Parametrización uniforme por tiempo y distancia para velocidad realista.
- [ ] **Paso 4.2:** Implementar `src/frontend/js/animation/timeline.js`:
  - Control de reproducción: Play, Pause, Rewind, Stop.
  - Barra de progreso temporal interactiva (scrubbing de timeline).
  - Selector de velocidad de simulación (0.5x, 1x, 2x).

---

### Fase 5: Módulo de Control Libre (Active Learning)
- [ ] **Paso 5.1:** Implementar `src/frontend/js/controls/free_control.js`:
  - Posibilidad de pulsar sobre un jugador y activar "Modo Control Libre" (atajo tecla `C` o botón HUD).
  - Manejo de entrada por teclado (WASD / Teclas de flecha) para desplazar la entidad en tiempo real.
  - El atleta controlado se desacopla de su spline precalculado, mientras el resto del equipo sigue ejecutando su animación sincronizada.
  - Comportamiento del balón: si el atleta poseído lleva el balón, el balón se traslada rígidamente con él.
  - Límites de campo: clamp de coordenadas para que no salga del terreno.

---

### Fase 6: Integración con Backend, Persistencia y Exportación
- [ ] **Paso 6.1:** Implementar `src/frontend/js/api/client.js` para comunicación con FastAPI:
  - Guardar jugada actual en backend (`POST /api/plays`).
  - Selector de jugadas guardadas para cargar en el lienzo.
  - Exportación directa a fichero JSON descargable.
  - Importación de ficheros JSON locales arrastrando o seleccionando archivo.
- [ ] **Paso 6.2:** Incluir jugada táctica de rugby predefinida de muestra (ej. "Jugada 8-9 ataque en lado ciego" o "Lanzamiento de backs tras melé").

---

### Fase 7: Scripts de Ejecución, Verificación y Auditoría
- [ ] **Paso 7.1:** Crear scripts de inicio y parada multiplataforma:
  - `start.cmd` / `stop.cmd` para Windows (gestión automática de `venv` y lanzamiento de Uvicorn).
  - `start.sh` / `stop.sh` para Linux / macOS.
- [ ] **Paso 7.2:** Ejecutar suite completa de tests con `pytest`.
- [ ] **Paso 7.3:** Fase `/code-simplify`: Revisión por pases (`docs/REVIEW.md`) comprobando Bugs, Seguridad y Cumplimiento de estándares de código (un solo `return`, guard clauses, tipado estricto y cabeceras de autoría).
- [ ] **Paso 7.4:** Fase `/ship`: Documentación en `walkthrough.md`, actualización de `CHANGELOG.md` a v0.1.0 (MVP), y propuesta de commit y git tag.

---

## 🔒 Criterios de Aceptación (DoD)

1. El servidor FastAPI arranca sin errores en `http://localhost:8000` y sirve la interfaz web y la documentación Swagger en `/docs`.
2. El campo de rugby se renderiza en Three.js con proporciones métricas reglamentarias exactas y líneas nítidas.
3. Se pueden colocar jugadores y balón, definir waypoints mediante arrastre y reproducir la animación suavemente sin tirones.
4. El modo **Control Libre** permite pilotar a cualquier jugador con WASD en tiempo real durante la simulación sin romper la sincronización del resto de jugadores.
5. Se pueden guardar, cargar y exportar jugadas en formato JSON válido.
6. Todos los tests de backend pasan (`pytest tests/`).
7. El código cumple los estándares de arquitectura y cabeceras del proyecto.
