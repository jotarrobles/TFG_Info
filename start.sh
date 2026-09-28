#!/usr/bin/env bash
# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

echo "[Pizarritas] Iniciando servidor de aplicacion..."

if [ ! -f "venv/bin/python" ]; then
    echo "[Pizarritas] Creando entorno virtual local..."
    python3 -m venv venv
    echo "[Pizarritas] Instalando dependencias desde requirements.txt..."
    ./venv/bin/pip install -r requirements.txt
fi

echo "[Pizarritas] Ejecutando servidor FastAPI / Uvicorn en http://localhost:8000"
./venv/bin/python -m uvicorn src.backend.main:app --host 0.0.0.0 --port 8000 --reload
