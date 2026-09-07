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

const salvarLote = (academiaId, fotos, fotoPrincipalIndex) => {
  const formData = new FormData();

  fotos.forEach((foto) => {
    formData.append('foto', foto);
  });

  if (Number.isInteger(fotoPrincipalIndex)) {
    formData.append('fotoPrincipalIndex', String(fotoPrincipalIndex));
  }

  return http.multipartInstance.post(`${API_URL}/${academiaId}/lote`, formData);
};

const listarPorAcademia = (academiaId) => {
  return http.mainInstance.get(`${API_URL}/academia/${academiaId}`);
};

const inativar = (fotoId) => {
  return http.mainInstance.put(`${API_URL}/${fotoId}/inativar`);
};

const definirPrincipal = (academiaId, fotoId) => {
  return http.mainInstance.put(`${API_URL}/${academiaId}/${fotoId}/principal`);
};

const getImagemUrl = (fotoId) => {
  return `${http.mainInstance.defaults.baseURL}${API_URL}/${fotoId}/imagem`;
};

const FotoAcademiaService = {
  salvar,
  salvarLote,
  listarPorAcademia,
  inativar,
  definirPrincipal,
  getImagemUrl
};

export default FotoAcademiaService;
