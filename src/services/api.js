import { API_CONFIG } from '../config/api.js';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Cadastrar usuário
  async registerUser(userData) {
    return this.request('/usuario', {
      method: 'POST',
      body: JSON.stringify({
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        nivelAcesso: userData.nivelAcesso,
        statusUsuario: true
      }),
    });
  }

  // Login (buscar usuário por email e verificar senha)
  async loginUser(email, senha) {
    const users = await this.request('/usuario');
    const user = users.find(u => u.email === email && u.senha === senha);

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    if (user.statusUsuario === false) {
      throw new Error('Conta inativada. Entre em contato com o suporte.');
    }

    return user;
  }

  // Buscar usuário por ID
  async getUserById(id) {
    return this.request(`/usuario/${id}`);
  }

  // Atualizar usuário
  async updateUser(id, userData) {
    return this.request(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async inactivateUser(id) {
    return this.request(`/usuario/inativar/${id}`, {
      method: 'PUT',
    });
  }


  // Cadastrar academia
  async registerAcademia(academiaData) {
    return this.request('/academia', {
      method: 'POST',
      body: JSON.stringify(academiaData),
    });
  }

  // MOCK: Login de academia (Simulação para o Frontend)
  async loginAcademia(email, senha) {
    console.warn("MOCK: Simulando login de Gerente/Academia sem o backend");

    // Simula um tempinho de carregamento de rede (500ms)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Vamos fingir que o login deu certo para qualquer e-mail/senha digitado
        resolve({
          id: 999, // ID fictício do usuário logado
          nome: "Gerente de Teste",
          email: email,
          nivel_acesso: 'PROPRIETÁRIO',
          statusUsuario: true
        });
      }, 500);
    });
  }

  // MOCK: Completar perfil do Gerente
  async completeManagerProfile(gerenteData) {
    console.warn("MOCK: Simulando salvamento do perfil do Gerente", gerenteData);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Finge que o backend salvou na tabela Gerente e devolveu sucesso
        resolve({
          id: 1, // ID do gerente gerado no banco fictício
          ...gerenteData,
          statusGerente: 'ATIVO'
        });
      }, 800);
    });
  }

  // Buscar academia por ID
  async getAcademiaById(id) {
    return this.request(`/academia/${id}`);
  }
  
  // Atualizar academia
  async updateAcademia(id, academiaData) {
    return this.request(`/academia/${id}`, {
      method: 'PUT',
      body: JSON.stringify(academiaData),
    });
  }
}

export default new ApiService();