// src/services/AvaliacaoService.js
import http from "../common/http-common";

const API_URL = "avaliacoes";

const findItensAvaliacao = () => {
  return http.mainInstance.get(`${API_URL}/itens`);
};

const findByAcademiaId = (academiaId, usuarioId = null) => {
  const params = usuarioId ? `?usuarioId=${usuarioId}` : "";
  return http.mainInstance.get(`${API_URL}/academia/${academiaId}${params}`);
};

const findAllAdmin = () => {
  return http.mainInstance.get(`${API_URL}/admin/all`);
};

const avaliar = (usuarioId, academiaId, avaliacao) => {
  return http.mainInstance.post(
    `${API_URL}?usuarioId=${usuarioId}&academiaId=${academiaId}`,
    avaliacao
  );
};

const inativar = (avaliacaoId, usuarioId) => {
  return http.mainInstance.put(`${API_URL}/${avaliacaoId}/inativar?usuarioId=${usuarioId}`);
};

const suspenderAdmin = (avaliacaoId) => {
  return http.mainInstance.put(`${API_URL}/admin/${avaliacaoId}/suspender`);
};

const reativarAdmin = (avaliacaoId) => {
  return http.mainInstance.put(`${API_URL}/admin/${avaliacaoId}/reativar`);
};

const AvaliacaoService = {
  findItensAvaliacao,
  findByAcademiaId,
  findAllAdmin,
  avaliar,
  inativar,
  suspenderAdmin,
  reativarAdmin
};

export default AvaliacaoService;
