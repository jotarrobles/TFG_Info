# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

from pathlib import Path
from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.backend.api.plays import router as plays_router

app = FastAPI(
    title="Pizarritas API",
    description="Backend para la plataforma de diseño, animación y simulación táctica de rugby.",
    version="0.1.0"
)

# Configuración de CORS para desarrollo y consumo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de routers de API
app.include_router(plays_router)


@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """Endpoint de comprobación de salud del servidor."""
    result = {
        "status": "healthy",
        "service": "Pizarritas Tactical Engine",
        "version": "0.1.0"
    }
    return result


# Montaje de la interfaz web frontend estática si el directorio existe
frontend_dir = Path("src/frontend")
if frontend_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
