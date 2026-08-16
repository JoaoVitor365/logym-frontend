// src/services/CategoriaService.js
import http from "../common/http-common";

const API_URL = "categorias";

const findAtivas = () => {
  return http.mainInstance.get(`${API_URL}/ativas`);
};

const findAllAdmin = () => {
  return http.mainInstance.get(`${API_URL}/admin/all`);
};

const create = (categoria) => {
  return http.mainInstance.post(`${API_URL}/admin`, categoria);
};

const update = (id, categoria) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}`, categoria);
};

const inativar = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/inativar`);
};

const reativar = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/reativar`);
};

const CategoriaService = {
  findAtivas,
  findAllAdmin,
  create,
  update,
  inativar,
  reativar
};

export default CategoriaService;
