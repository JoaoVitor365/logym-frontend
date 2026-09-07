// src/services/AcademiaService.js
import http from "../common/http-common";

const API_URL = "academias";

const create = (academia) => {
  return http.mainInstance.post(API_URL, academia);
};

const createWithPhotos = (academia, fotos, fotoPrincipalIndex) => {
  const formData = new FormData();
  formData.append('academia', new Blob([JSON.stringify(academia)], { type: 'application/json' }));

  fotos.forEach((foto) => {
    formData.append('foto', foto);
  });

  if (Number.isInteger(fotoPrincipalIndex)) {
    formData.append('fotoPrincipalIndex', String(fotoPrincipalIndex));
  }

  return http.multipartInstance.post(API_URL, formData);
};

const findAll = () => {
  return http.mainInstance.get(API_URL);
};

const getAcademiasProximas = () => {
  return http.mainInstance.get(`${API_URL}/proximas`);
};

const getAcademiasComparacao = (ids) => {
  return http.mainInstance.get(`${API_URL}/comparar`, {
    params: { ids: ids.join(',') }
  });
};

const findAllAdmin = () => {
  return http.mainInstance.get(`${API_URL}/admin/all`);
};

const findById = (id) => {
  return http.mainInstance.get(`${API_URL}/${id}`);
};

const findByGerenteId = (gerenteId) => {
  return http.mainInstance.get(`${API_URL}/gerente/${gerenteId}`);
};

const update = (id, academia) => {
  return http.mainInstance.put(`${API_URL}/${id}`, academia);
};

// Fluxo do gerente: inativa a própria academia.
const inativar = (id) => {
  return http.mainInstance.put(`${API_URL}/${id}/inativar`);
};

// Fluxo do gerente: reativa apenas academia INATIVA.
const reativar = (id) => {
  return http.mainInstance.put(`${API_URL}/${id}/reativar`);
};

// Fluxo do ADMIN: muda statusAcademia para SUSPENSA.
const suspenderAdmin = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/suspender`);
};

// Fluxo do ADMIN: reativa academia INATIVA ou SUSPENSA.
const reativarAdmin = (id) => {
  return http.mainInstance.put(`${API_URL}/admin/${id}/reativar`);
};

const AcademiaService = {
  create,
  createWithPhotos,
  findAll,
  getAcademiasProximas,
  getAcademiasComparacao,
  findAllAdmin,
  findById,
  findByGerenteId,
  update,
  inativar,
  reativar,
  suspenderAdmin,
  reativarAdmin
};

export default AcademiaService;
