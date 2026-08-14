// src/services/FotoAcademiaService.js
import http from "../common/http-common";

const API_URL = "fotos-academia";

const salvar = (academiaId, foto) => {
  const formData = new FormData();
  formData.append("foto", foto);

  return http.mainInstance.post(`${API_URL}/${academiaId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const listarPorAcademia = (academiaId) => {
  return http.mainInstance.get(`${API_URL}/academia/${academiaId}`);
};

const inativar = (fotoId) => {
  return http.mainInstance.put(`${API_URL}/${fotoId}/inativar`);
};

const getImagemUrl = (fotoId) => {
  return `${http.mainInstance.defaults.baseURL}${API_URL}/${fotoId}/imagem`;
};

const FotoAcademiaService = {
  salvar,
  listarPorAcademia,
  inativar,
  getImagemUrl
};

export default FotoAcademiaService;