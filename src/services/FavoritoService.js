// src/services/FavoritoService.js
import http from "../common/http-common";

const API_URL = "favoritos";

const toggle = (usuarioId, academiaId) => {
  return http.mainInstance.post(
    `${API_URL}/toggle?usuarioId=${usuarioId}&academiaId=${academiaId}`
  );
};

const isFavorito = (usuarioId, academiaId) => {
  return http.mainInstance.get(`${API_URL}/usuario/${usuarioId}/academia/${academiaId}`);
};

const findByUsuarioId = (usuarioId) => {
  return http.mainInstance.get(`${API_URL}/usuario/${usuarioId}`);
};

const FavoritoService = {
  toggle,
  isFavorito,
  findByUsuarioId
};

export default FavoritoService;