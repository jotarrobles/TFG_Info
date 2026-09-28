# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

from typing import List
from fastapi import APIRouter, HTTPException, status
from src.backend.models.play import Play, PlaySummary
from src.backend.services.play_service import PlayService

router = APIRouter(prefix="/api/plays", tags=["plays"])
_service = PlayService()


@router.get("", response_model=List[PlaySummary])
def list_plays() -> List[PlaySummary]:
    """Retorna la lista resumida de todas las jugadas tácticas disponibles."""
    result = _service.list_plays()
    return result


@router.get("/{play_id}", response_model=Play)
def get_play(play_id: str) -> Play:
    """Retorna los datos completos de una jugada táctica por su ID."""
    play = _service.get_play(play_id)
    if play is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La jugada con ID '{play_id}' no existe."
        )
    result = play
    return result


@router.post("", response_model=Play, status_code=status.HTTP_201_CREATED)
def create_or_save_play(play: Play) -> Play:
    """Crea o guarda una nueva jugada táctica con validación Pydantic."""
    saved_play = _service.save_play(play)
    result = saved_play
    return result


@router.put("/{play_id}", response_model=Play)
def update_play(play_id: str, play: Play) -> Play:
    """Actualiza una jugada táctica existente."""
    if play.id != play_id:
        play.id = play_id
    saved_play = _service.save_play(play)
    result = saved_play
    return result


@router.delete("/{play_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_play(play_id: str) -> None:
    """Elimina una jugada táctica existente."""
    deleted = _service.delete_play(play_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se pudo eliminar: la jugada '{play_id}' no existe."
        )
    return None


@router.post("/import", response_model=Play, status_code=status.HTTP_201_CREATED)
def import_play(play: Play) -> Play:
    """Importa y valida una jugada táctica completa desde un JSON estructurado."""
    saved_play = _service.save_play(play)
    result = saved_play
    return result
