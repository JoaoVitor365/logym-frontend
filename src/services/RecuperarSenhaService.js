import http from '../common/http-common';

const API_URL = '/recuperar-senha/';

const solicitarCodigo = (email) => {
  return http.mainInstance.post(`${API_URL}solicitar-codigo`, { email });
};

const validarCodigo = (email, codigo) => {
  return http.mainInstance.post(`${API_URL}validar-codigo`, { email, codigo });
};

const redefinirSenha = (email, codigo, novaSenha) => {
  return http.mainInstance.post(`${API_URL}redefinir-senha`, {
    email,
    codigo,
    novaSenha
  });
};

const RecuperarSenhaService = {
  solicitarCodigo,
  validarCodigo,
  redefinirSenha
};

export default RecuperarSenhaService;
