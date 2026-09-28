# Pizarritas 🏉

> **Pizarritas** — Software de Diseño, Animación y Simulación Táctica de Rugby (Trabajo de Fin de Grado).
> *Software for Tactical Design, Animation and Kinematic Simulation of Rugby.*

---

## 📑 Table of Contents / Índice

- [About / Sobre el proyecto](#about)
- [Requirements / Requisitos](#requirements)
- [Installation / Instalación](#installation)
- [How to run / Cómo ejecutar](#usage)
- [Project structure / Estructura del proyecto](#structure)
- [Changelog](#changelog)
- [License / Licencia](#license)

---

<a name="about"></a>
## 📌 About / Sobre el proyecto

**Pizarritas** es una plataforma software especializada para cuerpos técnicos y jugadores de rugby que combina la agilidad de la pizarra táctica tradicional (vista cenital 2D ortográfica) con la potencia de un motor de animación cinemática continua (Three.js/WebGL) y un modo de **control libre interactivo** para el aprendizaje motor y cognitivo de las jugadas. El backend en **FastAPI** proporciona servicios de persistencia, modelado de datos estructurado en JSON, validación y gestión de jugadas.

*Pizarritas is a specialized software platform for rugby coaches and players combining the agility of traditional tactical boards (cenital 2D orthographic view) with the power of a continuous kinematic animation engine (Three.js/WebGL) and an interactive free-control mode for tactical motor and cognitive learning. The FastAPI backend provides data persistence, structured JSON models, validation, and play management.*

**Built with / Construido con:**
- **Frontend:** Three.js, WebGL, HTML5 Canvas, JavaScript/TypeScript, CSS3
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, pytest
- **Framework SDD:** dbv-specs-ops v2.8.0

---

<a name="requirements"></a>
## 🧰 Requirements / Requisitos

- **Python 3.11+**
- **Navegador web moderno** con soporte WebGL (Chrome, Firefox, Edge, Safari)
- **Git**

---

<a name="installation"></a>
## ⚙️ Installation / Instalación

### 🐍 Backend (FastAPI)

```bash
# 1. Crear y activar entorno virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt
```

---

<a name="usage"></a>
## ▶️ How to run / Cómo ejecutar

### Windows:
```cmd
start.cmd
```

### macOS / Linux:
```bash
./start.sh
```

Abre tu navegador en / Open your browser at: `http://localhost:8000`

---

<a name="structure"></a>
## 📂 Project structure / Estructura del proyecto

```
/
├── dbv-specs-ops/    # Framework Spec-Driven Development (specs, architecture, task, memory)
├── src/              # Código fuente de la aplicación (Frontend Three.js + Backend FastAPI)
│   ├── backend/      # API FastAPI, esquemas Pydantic y lógica de persistencia
│   └── frontend/     # Pizarra táctica Three.js, shaders, controles e interfaz
├── tests/            # Tests unitarios y de integración (pytest)
├── GEMINI.md         # Activador Antigravity / Gemini CLI
├── ANTIGRAVITY.md    # Referencia extendida de Antigravity
├── CLAUDE.md         # Activador Claude Code / Cursor
├── LICENSE           # Licencia MIT
└── README.md         # Documentación principal
```

---

<a name="changelog"></a>
## 📋 Changelog

Consulta [CHANGELOG.md](./dbv-specs-ops/CHANGELOG.md) para el historial completo de cambios y versiones.

---

<a name="license"></a>
## 📄 License / Licencia

MIT License — see [LICENSE](./LICENSE) for details.

Copyright (c) 2026 Juan Robles Angulo

---

> 🛠️ Built with **[dbv-specs-ops](https://github.com/davidbuenov/dbv-specs-ops)** — the SDD framework for AI-assisted development.
> Created by [David Bueno Vallejo](https://github.com/davidbuenov) — free and open source.
