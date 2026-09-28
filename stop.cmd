@echo off
rem =============================================================================
rem Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
rem Copyright (c) 2026 Juan Robles Angulo
rem Licensed under the MIT License. See LICENSE for details.
rem Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
rem =============================================================================

echo [Pizarritas] Deteniendo servidor en el puerto 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
echo [Pizarritas] Servidor detenido correctamente.
