# =============================================================================
# Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
# Copyright (c) 2026 Juan Robles Angulo
# Licensed under the MIT License. See LICENSE for details.
# Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
# =============================================================================

import json
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from src.backend.models.play import (
    Play,
    PlaySummary,
    Entity,
    Waypoint,
    ActionType,
    EntityRole,
    TeamType,
    SurfaceType
)


class PlayService:
    """Servicio de gestión y almacenamiento de jugadas tácticas de rugby."""

    def __init__(self, storage_dir: Optional[Path] = None):
        if storage_dir is None:
            self.storage_dir = Path("data/plays")
        else:
            self.storage_dir = storage_dir
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._ensure_sample_play()

    def _ensure_sample_play(self) -> None:
        """Crea una jugada táctica de rugby reglamentaria si no existe ninguna."""
        existing_files = list(self.storage_dir.glob("*.json"))
        if not existing_files:
            sample = self._create_sample_rugby_play()
            self.save_play(sample)

    def _create_sample_rugby_play(self) -> Play:
        """Genera una jugada de ataque de rugby: Salida 8-9 por el lado ciego."""
        now_str = datetime.now(timezone.utc).isoformat()
        
        # Jugador 8: Número 8 (Forward)
        wps_8 = [
            Waypoint(id="w8-1", t=0.0, x=0.0, y=15.0, action=ActionType.RUN, speed=3.0),
            Waypoint(id="w8-2", t=1.5, x=5.0, y=20.0, action=ActionType.RUN, speed=5.0),
            Waypoint(id="w8-3", t=3.0, x=10.0, y=24.0, action=ActionType.PASS, speed=4.0),
            Waypoint(id="w8-4", t=5.0, x=14.0, y=26.0, action=ActionType.RUCK, speed=2.0),
        ]
        p8 = Entity(
            id="e-8",
            number=8,
            name="Número 8 (Pick & Go)",
            role=EntityRole.FORWARD,
            team=TeamType.ATTACK,
            color="#E63946",
            metadata_label="Nº 8",
            waypoints=wps_8
        )

        # Jugador 9: Medio Melé (Back)
        wps_9 = [
            Waypoint(id="w9-1", t=0.0, x=-1.0, y=16.0, action=ActionType.RUN, speed=3.5),
            Waypoint(id="w9-2", t=1.5, x=3.0, y=21.0, action=ActionType.RUN, speed=5.5),
            Waypoint(id="w9-3", t=3.0, x=8.0, y=27.0, action=ActionType.RUN, speed=6.0),
            Waypoint(id="w9-4", t=5.0, x=16.0, y=30.0, action=ActionType.PASS, speed=5.0),
        ]
        p9 = Entity(
            id="e-9",
            number=9,
            name="Medio Melé (Support)",
            role=EntityRole.BACK,
            team=TeamType.ATTACK,
            color="#E63946",
            metadata_label="Medio Melé",
            waypoints=wps_9
        )

        # Jugador 11: Ala Izquierdo (Back)
        wps_11 = [
            Waypoint(id="w11-1", t=0.0, x=-10.0, y=28.0, action=ActionType.RUN, speed=4.0),
            Waypoint(id="w11-2", t=2.0, x=0.0, y=30.0, action=ActionType.RUN, speed=7.0),
            Waypoint(id="w11-3", t=4.0, x=12.0, y=32.0, action=ActionType.RUN, speed=7.5),
            Waypoint(id="w11-4", t=6.0, x=25.0, y=33.0, action=ActionType.RUN, speed=8.0),
        ]
        p11 = Entity(
            id="e-11",
            number=11,
            name="Ala Izquierdo (Blindside Wing)",
            role=EntityRole.BACK,
            team=TeamType.ATTACK,
            color="#E63946",
            metadata_label="Ala",
            waypoints=wps_11
        )

        # Defensor 6: Flanker Defensivo
        wps_d6 = [
            Waypoint(id="wd6-1", t=0.0, x=2.0, y=14.0, action=ActionType.RUN, speed=2.0),
            Waypoint(id="wd6-2", t=1.5, x=6.0, y=18.0, action=ActionType.RUN, speed=4.5),
            Waypoint(id="wd6-3", t=3.5, x=11.0, y=25.0, action=ActionType.TACKLE, speed=5.0),
        ]
        pd6 = Entity(
            id="e-d6",
            number=6,
            name="Flanker Ciego",
            role=EntityRole.FORWARD,
            team=TeamType.DEFENSE,
            color="#1D3557",
            metadata_label="Flanker Def",
            waypoints=wps_d6
        )

        # Balón de Rugby
        wps_ball = [
            Waypoint(id="wb-1", t=0.0, x=0.0, y=15.0, action=ActionType.RUN, speed=3.0),
            Waypoint(id="wb-2", t=1.5, x=5.0, y=20.0, action=ActionType.RUN, speed=5.0),
            Waypoint(id="wb-3", t=3.0, x=8.0, y=27.0, action=ActionType.PASS, speed=8.0),
            Waypoint(id="wb-4", t=5.0, x=16.0, y=30.0, action=ActionType.RUN, speed=5.0),
        ]
        ball = Entity(
            id="e-ball",
            number=0,
            name="Balón de Rugby",
            role=EntityRole.BALL,
            team=TeamType.NEUTRAL,
            color="#E9C46A",
            metadata_label="Balón",
            waypoints=wps_ball
        )

        sample_play = Play(
            id="play-8-9-blindside",
            name="Ataque 8-9 por Lado Ciego",
            description="Salida del Nº 8 desde formación fija fijando al tercera línea y descarga rápida al medio melé para generar superioridad numérica con el ala en la banda.",
            surface_type=SurfaceType.HALF_PITCH,
            duration=6.5,
            entities=[p8, p9, p11, pd6, ball],
            created_at=now_str,
            updated_at=now_str
        )
        return sample_play

    def list_plays(self) -> List[PlaySummary]:
        """Recupera la lista resumida de todas las jugadas guardadas."""
        summaries: List[PlaySummary] = []
        for file_path in self.storage_dir.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    summary = PlaySummary(
                        id=data.get("id", file_path.stem),
                        name=data.get("name", "Sin título"),
                        description=data.get("description", ""),
                        surface_type=SurfaceType(data.get("surface_type", "full_pitch")),
                        duration=float(data.get("duration", 10.0)),
                        entity_count=len(data.get("entities", [])),
                        updated_at=data.get("updated_at", "")
                    )
                    summaries.append(summary)
            except Exception:
                continue
        
        result = sorted(summaries, key=lambda s: s.updated_at, reverse=True)
        return result

    def get_play(self, play_id: str) -> Optional[Play]:
        """Obtiene una jugada completa por su identificador."""
        target_file = self.storage_dir / f"{play_id}.json"
        result: Optional[Play] = None
        
        if target_file.exists():
            try:
                with open(target_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    result = Play.model_validate(data)
            except Exception:
                result = None
                
        return result

    def save_play(self, play: Play) -> Play:
        """Guarda o actualiza una jugada en almacenamiento JSON."""
        play.updated_at = datetime.now(timezone.utc).isoformat()
        target_file = self.storage_dir / f"{play.id}.json"
        
        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(play.model_dump(), f, indent=2, ensure_ascii=False)
            
        result = play
        return result

    def delete_play(self, play_id: str) -> bool:
        """Elimina una jugada guardada."""
        target_file = self.storage_dir / f"{play_id}.json"
        result = False
        
        if target_file.exists():
            target_file.unlink()
            result = True
            
        return result
