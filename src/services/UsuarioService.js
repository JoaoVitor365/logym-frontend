import http from "../common/http-common";

const API_URL = "/usuarios/";

const findAll = () => {
  return http.mainInstance.get(API_URL + "all");
};

const findById = (id) => {
  return http.mainInstance.get(API_URL + `${id}`);
};

const editar = (id, usuario, file = null) => {
  const formData = new FormData();

  formData.append(
    "usuario",
    new Blob([JSON.stringify(usuario)], { type: "application/json" })
  );

  if (file) {
    formData.append("file", file);
  }

  return http.multipartInstance.put(API_URL + `${id}`, formData);
};

const create = (nome, username, password, nivelAcesso, cep = null) => {
  return http.mainInstance.post(API_URL + "create", {
    nome,
    username,
    password,
    nivelAcesso,
    cep
  });
};

// Verifica se a conta está ATIVA, INATIVA ou SUSPENSA antes de tentar o login.
const verificarStatusLogin = (username) => {
  return http.mainInstance.get(API_URL + "verificar-status-login", {
    params: {
      username: username.trim().toLowerCase()
    }
  });
};

const login = async (username, password) => {
  const params = new URLSearchParams();

  params.append("username", username.trim().toLowerCase());
  params.append("password", password);

  await http.mainInstance.post("/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

const inativar = (id) => {
  return http.mainInstance.put(API_URL + `${id}/inativar`);
};

// Fluxo do ADMIN: salva statusUsuario = SUSPENSO no banco.
const suspender = (id) => {
  return http.mainInstance.put(API_URL + `${id}/suspender`);
};

const ativar = (id) => {
  return http.mainInstance.put(API_URL + `${id}/ativar`);
};

const alterarSenha = (id, novaSenha) => {
  return http.mainInstance.put(
    API_URL + `${id}/alterar-senha`,
    null,
    {
      params: { novaSenha }
    }
  );
};

const me = () => {
  return http.mainInstance.get(API_URL + "me");
};

const getFoto = (id) => {
  return http.mainInstance.get(API_URL + `${id}/foto`, {
    responseType: "blob"
  });
};

const UsuarioService = {
  findAll,
  findById,
  editar,
  create,
  verificarStatusLogin,
  login,
  inativar,
  suspender,
  ativar,
  alterarSenha,
  me,
  getFoto
};

export default UsuarioService;
