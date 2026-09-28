# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

from enum import Enum
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class ActionType(str, Enum):
    RUN = "run"
    PASS = "pass"
    KICK = "kick"
    RUCK = "ruck"
    TACKLE = "tackle"


class EntityRole(str, Enum):
    FORWARD = "forward"
    BACK = "back"
    BALL = "ball"


class TeamType(str, Enum):
    ATTACK = "attack"
    DEFENSE = "defense"
    NEUTRAL = "neutral"


class SurfaceType(str, Enum):
    FULL_PITCH = "full_pitch"
    HALF_PITCH = "half_pitch"
    TWENTY_TWO = "twenty_two"
    SCRUM = "scrum"
    LINEOUT = "lineout"


class Waypoint(BaseModel):
    id: str = Field(description="Identificador único del waypoint")
    t: float = Field(ge=0.0, description="Tiempo en segundos de la jugada")
    x: float = Field(description="Posición X en metros (longitudinal del campo)")
    y: float = Field(description="Posición Y en metros (transversal del campo)")
    action: ActionType = Field(default=ActionType.RUN, description="Acción táctica en este waypoint")
    speed: float = Field(default=5.0, ge=0.0, description="Velocidad objetivo estimada en m/s")


class Entity(BaseModel):
    id: str = Field(description="Identificador único de la entidad")
    number: int = Field(ge=0, le=99, description="Dorsal del jugador (0 para balón)")
    name: str = Field(description="Nombre identificativo o rol del jugador")
    role: EntityRole = Field(description="Rol táctico en el rugby: forward, back o ball")
    team: TeamType = Field(description="Equipo: attack, defense o neutral")
    color: str = Field(description="Código de color HEX de la ficha")
    avatar_url: Optional[str] = Field(default=None, description="URL opcional de foto/avatar")
    metadata_label: Optional[str] = Field(default=None, description="Etiqueta táctica visible (ej. Fly-Half, Pod)")
    waypoints: List[Waypoint] = Field(default_factory=list, description="Lista ordenada de waypoints")
    is_active: bool = Field(default=True, description="Estado de actividad en la jugada")


class Play(BaseModel):
    id: str = Field(description="Identificador único de la jugada")
    name: str = Field(description="Nombre de la jugada táctica")
    description: Optional[str] = Field(default="", description="Descripción detallada de la táctica")
    surface_type: SurfaceType = Field(default=SurfaceType.FULL_PITCH, description="Encuadre del terreno")
    duration: float = Field(default=10.0, gt=0.0, description="Duración total calculada de la jugada en segundos")
    entities: List[Entity] = Field(default_factory=list, description="Conjunto de entidades tácticas participantes")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="Fecha de creación ISO")
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="Fecha de actualización ISO")


class PlaySummary(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    surface_type: SurfaceType
    duration: float
    entity_count: int
    updated_at: str
