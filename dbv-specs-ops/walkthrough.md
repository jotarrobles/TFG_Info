# 🚀 Walkthrough de Entrega: Pizarritas (v0.1.0 MVP)

> **Proyecto:** Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby (TFG)
> **Fecha de Entrega:** 2026-09-29
> **Autor:** Juan Robles Angulo
> **Versión:** 0.1.0 (MVP)

---

## 🎯 Objetivo Cumplido

Se ha especificado, diseñado e implementado con éxito el **Producto Mínimo Viable (MVP)** de **Pizarritas** siguiendo la metodología **Spec-Driven Development (SDD)** con el framework `dbv-specs-ops` v2.8.0.

El software transforma los esquemas tácticos tradicionales de rugby en una experiencia interactiva en tiempo real sobre WebGL (Three.js), combinando cinemática continua con la innovadora capacidad de **Control Libre** para el aprendizaje motor y cognitivo del atleta, respaldado por una API REST en FastAPI.

---

## 🛠 Componentes Implementados y Verificados

### 1. Backend REST y Modelos de Datos (FastAPI + Pydantic v2)
- **Modelos de Dominio de Rugby:** `Play`, `Entity`, `Waypoint`, `ActionType` (carrera, pase, patada, ruck, placaje), `EntityRole` (forwards 1-8, backs 9-15, balón) y `SurfaceType` (campo completo, medio campo, 22m, melé, touch).
- **Servicio de Persistencia:** Almacenamiento local estructurado en ficheros JSON dentro de `data/plays/`, con sanitización de identificadores contra path traversal.
- **Endpoints REST CRUD:**
  - `GET /api/plays`: Catálogo resumido de jugadas tácticas.
  - `GET /api/plays/{id}`: Detalle completo de coordenadas y trayectorias.
  - `POST /api/plays`: Creación y guardado con validación estricta.
  - `PUT /api/plays/{id}`: Actualización de jugadas.
  - `DELETE /api/plays/{id}`: Eliminación de jugadas.
  - `POST /api/plays/import`: Importación y validación de archivos JSON.
- **Jugada de Demostración:** Precargada *"Ataque 8-9 por Lado Ciego"* con 5 entidades y trayectorias sincronizadas.

### 2. Terreno de Juego Oficial de Rugby (Three.js WebGL)
- **Cámara Ortográfica Cenital (Escala 1m = 1 unidad):** Proyección bidimensional que elimina la distorsión de perspectiva y garantiza precisión métrica.
- **Marcado Reglamentario World Rugby (Law 1):**
  - Campo de juego de 100m x 70m con zonas de ensayo (in-goals) de 10m en cada extremo (total 120m).
  - Línea de medio campo (50m), líneas de ensayo, líneas de 22m, líneas discontinuas de 10m, líneas longitudinales de 5m y 15m, y postes en H.
- **Encuadres Dinámicos de Cámara:** Conmutación instantánea entre Campo Completo, Medio Campo, Zona 22m, Melé (Scrum) y Touch (Lineout).

### 3. Fichas Tácticas y Personalización
- **Fichas de Jugadores:** Renderizado circular con dorsales tipográficos generados dinámicamente sobre texturas canvas. Código cromático configurable (Rojo Ataque `#E63946`, Azul Defensa `#1D3557`).
- **Distinción Táctica Forwards vs Backs:** Doble aro concéntrico para la delantera (dorsales 1 al 8) y aro estilizado para los tres cuartos (dorsales 9 al 15).
- **Balón de Rugby Oficial:** Geometría ovalada (esferoide prolato) en tono cuero/oro `#E9C46A` con costura blanca.

### 4. Motor de Animación Cinemática e Interpolación
- **Splines Catmull-Rom Continuos:** Curvas paramétricas uniformes que garantizan desplazamientos fluidos y velocidades realistas a 60 FPS sin saltos discretos.
- **Línea de Tiempo HUD:** Barra interactiva con Play, Pause, Stop, Scrubbing temporal y multiplicadores de velocidad (`0.5x`, `1.0x`, `2.0x`).

### 5. Modo de Control Libre (Active Learning)
- Permite pulsar la tecla `[C]` o el botón del HUD para tomar el control directo del atleta seleccionado con el teclado (`WASD` o `Flechas`).
- Desacoplamiento temporal de la trayectoria programada: el jugador piloteado se desplaza libremente por el campo mientras el resto de entidades continúa ejecutando sus trayectorias automáticas sincronizadas.
- Traslado rígido del balón cuando el portador se desplaza en control libre.

### 6. Scripts de Ejecución Multiplataforma
- `start.cmd` / `stop.cmd` para entornos Windows.
- `start.sh` / `stop.sh` para entornos Linux y macOS.

---

## 🧪 Verificación y Pruebas

- **Tests Automatizados (`pytest`):** 5/5 tests unitarios aprobados en [test_api.py](file:///c:/Users/Juan%20Robles%20Angulo/TFG/tests/backend/test_api.py):
  1. `test_health_check` PASSED
  2. `test_list_plays` PASSED
  3. `test_get_play_detail` PASSED
  4. `test_create_and_delete_play` PASSED
  5. `test_path_traversal_protection` PASSED
- **Pruebas de Integración HTTP:** Verificada la entrega con código HTTP 200 de `index.html`, `style.css`, `app.js` y endpoints `/api/plays`.
