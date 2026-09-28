# 📋 Especificaciones: Pizarritas

> **Fase:** `/spec` (Especificación)
> **Estado:** Validado
> **Última Revisión:** 2026-09-28
> **Documento Origen:** `especificacionInicial.md` (Propuesta de TFG)

---

## 🎯 1. Contexto y Objetivos

- **Problema:** En el rugby de alto rendimiento, el diseño y preparación táctica dependen con frecuencia de pizarras analógicas estáticas o herramientas de dibujo vectorial genéricas. Estas herramientas carecen de modelado dinámico, no representan la cinemática de los jugadores, no permiten validar intervalos temporales y no ofrecen interactividad práctica para el deportista.
- **Objetivo (Éxito):** Desarrollar **Pizarritas**, una plataforma software integral que una la agilidad de la pizarra táctica tradicional con la potencia de un motor de simulación en tiempo real (Three.js/WebGL en frontend y FastAPI en backend), permitiendo diagramar, animar con interpolación continua, simular interactivamente con "control libre" del atleta y persistir/compartir jugadas en formato estructurado JSON.

---

## 👥 2. Usuarios y Escenarios

- **Perfil de Usuario:**
  - **Cuerpo Técnico / Entrenadores:** Diseñan jugadas tácticas, ajustan líneas de ataque/defensa, establecen tiempos y sincronismos, y configuran entrenamientos.
  - **Jugadores / Atletas:** Visualizan las animaciones tácticas, comprenden su rol dentro del colectivo y practican la toma de decisiones y trayectorias mediante el modo de "control libre".
- **Escenarios Clave:**
  - *Escenario A (Pizarra Táctica Cenital):* El entrenador posiciona rápidamente a los jugadores en un campo de rugby (o set-piece como scrum/lineout/22m), asigna vectores de carrera y pases con drag-and-drop en proyección ortográfica.
  - *Escenario B (Animación Cinemática Continua):* El sistema calcula en tiempo real las trayectorias suaves (splines Catmull-Rom) a través de los waypoints fijados, sincronizando la velocidad y tiempos de llegada.
  - *Escenario C (Control Libre para Aprendizaje Activo):* Durante la reproducción de la jugada, el atleta toma el control de su avatar (con teclado o puntero), desvinculándose de la ruta precalculada mientras el resto del equipo continúa la ejecución programada.
  - *Escenario D (Persistencia e Intercambio):* Guardar la jugada en la base de datos a través de la API REST de FastAPI y exportar/importar en formato JSON estructurado.

---

## ✨ 3. Funcionalidades Principales (Requisitos del MVP)

- [ ] **REQ-1: Vista Cenital y Lienzo Táctico (Three.js Orthographic Canvas)**
  - Representación métrica y ortográfica del campo de rugby con dimensiones y líneas oficiales (ensayo, 22m, 10m, 50m, 5m, 15m).
  - Soporte de encuadres: Campo completo, Medio campo, Zona de 22 metros y estructuras de set-piece (scrum y lineout).
  - Navegación ágil (pan, zoom ortográfico) y manipulación interactiva de entidades.
- [ ] **REQ-2: Gestión de Entidades (Jugadores y Balón)**
  - Entidades interactivas para equipo atacante y equipo defensor con identificación cromática configurable.
  - Roles específicos de rugby: Distinción entre forwards (1-8) y backs (9-15), dorsales, nombres y etiquetas de texto asociadas.
  - Entidad Balón con estado de posesión o trayectoria de pase/patada.
- [ ] **REQ-3: Módulo de Trazado Vectorial y Waypoints**
  - Trazado de trayectorias mediante puntos de paso (waypoints) editables (drag & drop).
  - Tipos de vectores: Carrera del jugador (línea continua/curva), Pase del balón (línea discontinua), Patada (línea punteada o arco).
- [ ] **REQ-4: Motor de Animación e Interpolación Cinemática**
  - Cálculo de trayectorias continuas mediante interpolación Spline (Catmull-Rom o Bézier cúbico).
  - Controles de reproducción interactiva: Play, Pause, Rewind, Scrubbing de línea de tiempo y ajuste de velocidad (0.5x, 1x, 2x).
- [ ] **REQ-5: Módulo de Control Libre (Active Learning)**
  - Posibilidad de seleccionar un jugador durante la reproducción y tomar su control directo en tiempo real (WASD / Flechas / Puntero).
  - Desacoplamiento temporal de la trayectoria programada manteniendo la ejecución del resto de jugadores.
- [ ] **REQ-6: Backend de Persistencia y API REST (FastAPI)**
  - Modelos de datos estructurados con Pydantic v2 (Esquema de Jugada, Entidades, Waypoints, Metadatos).
  - Endpoints CRUD para crear, listar, consultar, actualizar y eliminar jugadas tácticas.
  - Importación y exportación de ficheros JSON portables y validados.

---

## 🏗️ 4. Propuesta de Solución Técnica (Resumen)

- **Frontend:** Single Page Application modular utilizando **Three.js** con cámara ortográfica (`OrthographicCamera`) para garantizar fidelidad espacial y métrica sin distorsión de perspectiva, controles de puntero basados en raycasting para selección y drag-and-drop, y panel de control flotante en CSS3 moderno.
- **Backend:** **FastAPI** (Python 3.11+) con modelos Pydantic v2 para validación estricta de esquemas tácticos, almacenamiento en SQLite/JSON para persistencia local de jugadas, y endpoints REST documentados automáticamente con OpenAPI/Swagger.
- **Sistema de Diseño:** Definido en `docs/DESIGN.md`, utilizando un tema táctico atlético (verde campo césped técnico `#1E5128`, líneas blancas `#F4F6F0`, ataque `#E63946`, defensa `#1D3557`, balón cuero/oro `#E9C46A`, fondo de interfaz dark `#12161A`).

---

## 🚫 5. Fuera de Alcance (Out of Scope para el MVP)

- [ ] Simulación 3D multicámara inmersiva y vista POV (Point-of-View en primera persona con modelos 3D poligonales de jugadores).
- [ ] Inteligencia artificial autónoma reactiva para la defensa (blitz defense o drift defense con árboles de comportamiento).
- [ ] Modelado biométrico avanzado con simulación física de placajes / colisiones de cuerpos rígidos con masa variable.
- [ ] Autenticación multi-usuario y roles de club (se deja para versión post-MVP).

---

## ⚠️ 6. Riesgos y Mitigación

- **Riesgo 1: Complejidad en la sincronización de animaciones e interpolación con Three.js.**
  - *Mitigación:* Usar curvas normalizadas `THREE.CatmullRomCurve3` con parametrización por longitud de arco y un bucle de tiempo global (delta time) que asegure sincronismo independiente de los FPS.
- **Riesgo 2: Pérdida de control o colisiones anómalas en el modo "Control Libre".**
  - *Mitigación:* Acotar el movimiento a los límites del campo con clamp de coordenadas y aplicar interpolación suave al devolver el control a la trayectoria automatizada.
- **Riesgo 3: Formato JSON inconsistente al importar jugadas.**
  - *Mitigación:* Validación exhaustiva en el backend con esquemas Pydantic v2, rechazando datos malformados con mensajes descriptivos.

---

## ❓ 7. Preguntas Resueltas y Decisiones de Diseño

- **¿Vista 2D o 3D?** Se utiliza Three.js con cámara ortográfica (cenital 2D) como vista principal del MVP, manteniendo la infraestructura 3D lista para las extensiones futuras.
- **¿Formato de persistencia?** Esquemas JSON serializables tanto en el cliente como en el backend con FastAPI.