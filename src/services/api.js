// Configuração da API para comunicação com o backend
import axios from 'axios';

// URL base da API
const API_BASE_URL = 'http://localhost:3001/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou, remover do localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirecionar para login se necessário
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções da API

// Autenticação
export const authAPI = {
  // Registrar usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Login do usuário
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};

// Academias
export const academyAPI = {
  // Buscar todas as academias
  getAll: async () => {
    const response = await api.get('/academies');
    return response.data;
  },
  
  // Buscar academia por ID
  getById: async (id) => {
    const response = await api.get(`/academies/${id}`);
    return response.data;
  },
  
  // Buscar academias com filtro
  search: async (searchTerm) => {
    const response = await api.get(`/academies?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },
  
  // Criar nova academia
  create: async (academyData) => {
    const response = await api.post('/academies', academyData);
    return response.data;
  }
};

export default api;