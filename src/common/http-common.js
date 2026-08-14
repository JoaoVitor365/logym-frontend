import axios from "axios";

// const API_URL = "https://projeto.com.br/";
const API_URL = "http://localhost:8080/";

// ✅ JSON padrão
const mainInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ MULTIPART (sem forçar Content-Type)
const multipartInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
  // 🚫 NÃO colocar Content-Type aqui
});

// ✅ API externa (ViaCEP)
const apiCep = axios.create({
  baseURL: "https://viacep.com.br/ws/",
  headers: {
    "Content-Type": "application/json"
  }
});

const httpCommon = {
  mainInstance,
  multipartInstance,
  apiCep,
};

export default httpCommon;