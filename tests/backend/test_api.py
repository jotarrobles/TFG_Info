# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

import pytest
from fastapi.testclient import TestClient
from src.backend.main import app
from src.backend.models.play import (
    Play,
    Entity,
    Waypoint,
    ActionType,
    EntityRole,
    TeamType,
    SurfaceType
)

client = TestClient(app)


def test_health_check() -> None:
    """Verifica que el endpoint de salud responda correctamente."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Pizarritas Tactical Engine"


def test_list_plays() -> None:
    """Verifica la lista de jugadas almacenadas."""
    response = client.get("/api/plays")
    assert response.status_code == 200
    plays = response.json()
    assert isinstance(plays, list)
    assert len(plays) >= 1
    assert plays[0]["id"] == "play-8-9-blindside"


def test_get_play_detail() -> None:
    """Verifica la obtención de una jugada táctica específica."""
    response = client.get("/api/plays/play-8-9-blindside")
    assert response.status_code == 200
    play = response.json()
    assert play["name"] == "Ataque 8-9 por Lado Ciego"
    assert len(play["entities"]) == 5
    assert any(e["role"] == "ball" for e in play["entities"])


def test_create_and_delete_play() -> None:
    """Verifica la creación y posterior eliminación de una jugada."""
    wp = Waypoint(id="w-test-1", t=0.0, x=10.0, y=10.0, action=ActionType.RUN, speed=5.0)
    entity = Entity(
        id="e-test-1",
        number=10,
        name="Apertura Test",
        role=EntityRole.BACK,
        team=TeamType.ATTACK,
        color="#E63946",
        waypoints=[wp]
    )
    new_play = Play(
        id="play-test-crud",
        name="Jugada de Prueba Pytest",
        description="Descripción test",
        surface_type=SurfaceType.TWENTY_TWO,
        duration=5.0,
        entities=[entity]
    )

    # Crear jugada
    create_res = client.post("/api/plays", json=new_play.model_dump())
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["id"] == "play-test-crud"

    # Verificar existencia
    get_res = client.get("/api/plays/play-test-crud")
    assert get_res.status_code == 200

    # Eliminar jugada
    del_res = client.delete("/api/plays/play-test-crud")
    assert del_res.status_code == 204

    # Verificar que ya no existe
    get_after_del = client.get("/api/plays/play-test-crud")
    assert get_after_del.status_code == 404


def test_path_traversal_protection() -> None:
    """Verifica que los intentos de path traversal sean neutralizados."""
    response = client.get("/api/plays/../../etc/passwd")
    # FastAPI o el sanitizador deben devolver 404
    assert response.status_code == 404
