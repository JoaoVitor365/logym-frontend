// src/services/GerenteService.js
import http from "../common/http-common";

const API_URL = "gerentes";

const create = (gerente) => {
  return http.mainInstance.post(API_URL, gerente);
};

const findAll = () => {
  return http.mainInstance.get(`${API_URL}/all`);
};

const findByUsuarioId = (usuarioId) => {
  return http.mainInstance.get(`${API_URL}/usuario/${usuarioId}`);
};

const findById = (id) => {
  return http.mainInstance.get(`${API_URL}/${id}`);
};

const GerenteService = {
  create,
  findAll,
  findByUsuarioId,
  findById
};

export default GerenteService;