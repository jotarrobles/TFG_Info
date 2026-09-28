#!/usr/bin/env bash
# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

echo "[Pizarritas] Deteniendo servidor en el puerto 8000..."
PID=$(lsof -ti:8000)
if [ -n "$PID" ]; then
    kill -9 $PID
    echo "[Pizarritas] Proceso $PID detenido."
else
    echo "[Pizarritas] No se encontro ningun servidor corriendo en el puerto 8000."
fi
