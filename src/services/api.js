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
        statusUsuario: 'ATIVO'
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
    
    if (user.statusUsuario === 'INATIVO') {
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

  // Inativar conta
  async inactivateUser(id) {
    return this.request(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statusUsuario: 'INATIVO' }),
    });
  }

  // Reativar conta
  async reactivateUser(id) {
    return this.request(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statusUsuario: 'ATIVO' }),
    });
  }

  // Cadastrar academia
  async registerAcademia(academiaData) {
    return this.request('/academia', {
      method: 'POST',
      body: JSON.stringify(academiaData),
    });
  }

  // Login de academia (buscar por email e senha)
  async loginAcademia(email, senha) {
    const academias = await this.request('/academia');
    const academia = academias.find(a => a.email === email && a.password === senha);
    
    if (!academia) {
      throw new Error('Email ou senha incorretos');
    }
    
    if (academia.statusAcademia === false) {
      throw new Error('Academia inativada. Entre em contato com o suporte.');
    }
    
    return academia;
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