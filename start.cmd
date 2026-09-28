@echo off
rem =============================================================================
rem Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
rem Copyright (c) 2026 Juan Robles Angulo
rem Licensed under the MIT License. See LICENSE for details.
rem Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
rem =============================================================================

echo [Pizarritas] Iniciando servidor de aplicacion...

if not exist "venv\Scripts\python.exe" (
    echo [Pizarritas] Creando entorno virtual local...
    python -m venv venv
    echo [Pizarritas] Instalando dependencias desde requirements.txt...
    venv\Scripts\pip install -r requirements.txt
)

echo [Pizarritas] Abriendo navegador en http://localhost:8000 ...
start http://localhost:8000

echo [Pizarritas] Ejecutando servidor FastAPI / Uvicorn en http://localhost:8000
venv\Scripts\python.exe -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000 --reload
