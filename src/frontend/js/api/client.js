// =============================================================================
// Pizarritas — Software de Diseño, Animación y Simulación Táctica de Rugby
// Copyright (c) 2026 Juan Robles Angulo
// Licensed under the MIT License. See LICENSE for details.
// Built with dbv-specs-ops · https://github.com/davidbuenov/dbv-specs-ops
// =============================================================================

/**
 * Cliente HTTP para comunicación REST con la API de FastAPI.
 */
class PizarritasApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async listPlays() {
    try {
      const res = await fetch(`${this.baseUrl}/api/plays`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('No se pudo conectar con FastAPI para listar jugadas:', err);
      return [];
    }
  }

  async getPlay(playId) {
    try {
      const res = await fetch(`${this.baseUrl}/api/plays/${playId}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Error al cargar la jugada '${playId}':`, err);
      return null;
    }
  }

  async savePlay(playData) {
    try {
      const res = await fetch(`${this.baseUrl}/api/plays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playData),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Error al guardar la jugada en FastAPI:', err);
      throw err;
    }
  }

  async deletePlay(playId) {
    try {
      const res = await fetch(`${this.baseUrl}/api/plays/${playId}`, {
        method: 'DELETE',
      });
      return res.status === 204;
    } catch (err) {
      console.error(`Error al eliminar la jugada '${playId}':`, err);
      return false;
    }
  }

  exportToJsonFile(playData) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(playData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${playData.id || 'jugada-rugby'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  async importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const res = await fetch(`${this.baseUrl}/api/plays/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error('El JSON no cumple el esquema Pydantic oficial.');
      return await res.json();
    } catch (err) {
      console.error('Error al importar jugada:', err);
      throw err;
    }
  }
}
