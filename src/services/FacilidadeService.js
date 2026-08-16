// src/services/FacilidadeService.js
import http from "../common/http-common";

const API_URL = "facilidades";

const findAtivas = () => {
  return http.mainInstance.get(`${API_URL}/ativas`);
};

const findAllAdmin = () => {
  return http.mainInstance.get(`${API_URL}/admin/all`);
};

const create = (facilidade) => {
  return http.mainInstance.post(`${API_URL}/admin`, facilidade);
};

const update = (id, facilidade) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}`, facilidade);
};

const inativar = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/inativar`);
};

const reativar = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/reativar`);
};

const FacilidadeService = {
  findAtivas,
  findAllAdmin,
  create,
  update,
  inativar,
  reativar
};

export default FacilidadeService;
