// src/pages/AcademyRegisterPage.jsx - Página de cadastro de academia com integração ao backend
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { academyAPI } from '../services/api';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import '../styles/pages/_academyRegister.css';
import logo from '../assets/logoFundo.png'; 

// Lista de estados e cidades (simplificada para demonstração)
const states = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name:'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' }, { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' }, { uf: 'TO', name: 'Tocantins' }
];

// Lista de facilidades comuns (você pode expandir esta lista)
const commonFacilities = [
  'Musculação', 'Aulas Coletivas (Zumba, Spinning, Yoga)', 'CrossFit', 'Personal Trainer',
  'Piscina', 'Quadra Poliesportiva', 'Vestiários', 'Estacionamento', 'Wi-Fi'
];


function AcademyRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    description: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated } = useAuth(); // Verificar se usuário está logado
  const navigate = useNavigate();

  // Verificar se usuário está logado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Mapeamento dos nomes de campos para exibição em português
  const fieldNames = {
    name: 'nome da academia',
    address: 'endereço',
    city: 'cidade',
    state: 'estado',
    phone: 'telefone',
    email: 'e-mail de contato',
    description: 'descrição da academia'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpa o erro ao começar a digitar
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validação de campos obrigatórios
    const requiredFields = ['name', 'address', 'city', 'state', 'description'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `O campo ${fieldNames[field]} é obrigatório.`;
        isValid = false;
      }
    });

    // Validação de E-mail (opcional)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Criar academia via API
      const response = await academyAPI.create(formData);
      
      if (response.success) {
        // Redirecionar para página inicial com sucesso
        navigate('/', { state: { message: 'Academia cadastrada com sucesso!' } });
      }
    } catch (error) {
      console.error('Erro ao cadastrar academia:', error);
      
      // Tratar erros da API
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Erro ao cadastrar academia. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="academy-register-page">
      <div className="academy-register-form-container">
        <div className="academy-register-header">
          <img src={logo} alt="Logo da LOGYM" className="academy-register-logo" />
          <h1>Cadastrar Nova Academia</h1>
        </div>
        {/* Mostrar erro geral se houver */}
        <ErrorMessage message={errors.general} />
        <form onSubmit={handleSubmit} noValidate>
          {/* Informações Básicas */}
          <Input
            label="Nome da Academia"
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Academia Fitness Total"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.name} />

          <Input
            label="E-mail de Contato (Opcional)"
            type="email"
            id="email"
            name="email"
            placeholder="contato@suaacademia.com"
            value={formData.email}
            onChange={handleChange}
          />
          <ErrorMessage message={errors.email} />

          <Input
            label="Telefone (Opcional)"
            type="tel"
            id="phone"
            name="phone"
            placeholder="(XX) XXXX-XXXX"
            value={formData.phone}
            onChange={handleChange}
          />
          <ErrorMessage message={errors.phone} />

          {/* Endereço */}
          <Input
            label="Endereço Completo"
            type="text"
            id="address"
            name="address"
            placeholder="Rua/Avenida, Número, Bairro"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.address} />

          <div className="input-group">
            <label htmlFor="state" className="input-label">Estado</label>
            <select
              id="state"
              name="state"
              className="select-field"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o Estado</option>
              {states.map((s) => (
                <option key={s.uf} value={s.uf}>{s.name} ({s.uf})</option>
              ))}
            </select>
          </div>
          <ErrorMessage message={errors.state} />

          <Input
            label="Cidade"
            type="text"
            id="city"
            name="city"
            placeholder="Sua Cidade"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.city} />

          {/* Descrição */}
          <div className="input-group">
            <label htmlFor="description" className="input-label">Descrição da Academia</label>
            <textarea
              id="description"
              name="description"
              className="textarea-field"
              rows="5"
              placeholder="Descreva sua academia, seus diferenciais, ambiente, etc."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <ErrorMessage message={errors.description} />

          {/* Avaliação inicial */}
          <div className="input-group">
            <label htmlFor="rating" className="input-label">Avaliação Inicial (0-5)</label>
            <select
              id="rating"
              name="rating"
              className="select-field"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="0">0 - Sem avaliação</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐⭐</option>
              <option value="3">3 ⭐⭐⭐</option>
              <option value="4">4 ⭐⭐⭐⭐</option>
              <option value="5">5 ⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          {/* Botão de Cadastro */}
          <Button 
            type="submit" 
            className="button-primary"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Academia'}
          </Button>
        </form>
        <p>
          Já tem uma conta? <Link to="/login" className="link">Fazer Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AcademyRegisterPage;
