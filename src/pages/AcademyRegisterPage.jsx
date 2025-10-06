// src/pages/AcademyRegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    facilities: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  // Mapeamento dos nomes de campos para exibição em português
  const fieldNames = {
    name: 'nome da academia',
    cnpj: 'CNPJ',
    address: 'endereço',
    number: 'número',
    neighborhood: 'bairro',
    city: 'cidade',
    state: 'estado',
    zipCode: 'CEP',
    phone: 'telefone',
    email: 'e-mail de contato',
    password: 'senha',
    confirmPassword: 'confirmação de senha',
    description: 'descrição da academia'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpa o erro ao começar a digitar
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
    setApiMessage('');

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        facilities: checked
          ? [...prev.facilities, value]
          : prev.facilities.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validação de campos obrigatórios
    for (const key in formData) {
      if (key !== 'facilities' && key !== 'password' && key !== 'confirmPassword') {
        if (!formData[key]) {
          // Usa o mapeamento para pegar o nome do campo em português
          newErrors[key] = `O campo ${fieldNames[key]} é obrigatório.`;
          isValid = false;
        }
      }
    }

    // Validação de E-mail
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido.';
      isValid = false;
    }

    // Validação de Senha
    if (!formData.password) {
      newErrors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    // Validação de Confirmação de Senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'A confirmação de senha é obrigatória.';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        const academiaData = {
          nome: formData.name,
          cnpj: formData.cnpj,
          endereco: formData.address,
          numero: formData.number,
          bairro: formData.neighborhood,
          cidade: formData.city,
          estado: formData.state,
          cep: formData.zipCode,
          telefone: formData.phone,
          email: formData.email,
          password: formData.password,
          descricao: formData.description,
          facilidades: formData.facilities
        };
        
        const novaAcademia = await ApiService.registerAcademia(academiaData);
        
        setApiMessage(`🎉 Academia ${novaAcademia.nome} cadastrada com sucesso! Redirecionando...`);
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } catch (error) {
        setApiMessage(`Erro: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="academy-register-page">
      <div className="academy-register-form-container">
        <div className="academy-register-header">
          <img src={logo} alt="Logo da LOGYM" className="academy-register-logo" />
          <h1>Cadastrar Nova Academia</h1>
        </div>
        {apiMessage && (
          <p className={apiMessage.startsWith('Erro') ? 'error-message' : 'success-message'} style={{
            padding: '10px', 
            borderRadius: '5px',
            backgroundColor: apiMessage.startsWith('Erro') ? '#f8d7da' : '#d4edda', 
            color: apiMessage.startsWith('Erro') ? '#721c24' : '#155724',
            marginBottom: '15px'
          }}>
            {apiMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} noValidate>
          {/* Informações Básicas */}
          <Input
            label="Nome da Academia"
            type="text"
            id="name"
            name="name"
            placeholder="Ex: Academia Fitness Total"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.name} />

          <Input
            label="CNPJ"
            type="text"
            id="cnpj"
            name="cnpj"
            placeholder="Ex: 00.000.000/0000-00"
            value={formData.cnpj || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.cnpj} />

          <Input
            label="E-mail de Contato"
            type="email"
            id="email"
            name="email"
            placeholder="contato@suaacademia.com"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.email} />

          <Input
            label="Telefone"
            type="tel"
            id="phone"
            name="phone"
            placeholder="(XX) XXXX-XXXX"
            value={formData.phone || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.phone} />

          {/* Novos campos de Senha */}
          <Input
            label="Senha"
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha"
            value={formData.password || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.password} />

          <Input
            label="Confirmar Senha"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repita a senha"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.confirmPassword} />

          {/* Endereço */}
          <Input
            label="Endereço"
            type="text"
            id="address"
            name="address"
            placeholder="Nome da Rua/Avenida"
            value={formData.address || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.address} />

          <Input
            label="Número"
            type="text"
            id="number"
            name="number"
            placeholder="123"
            value={formData.number || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.number} />

          <Input
            label="Bairro"
            type="text"
            id="neighborhood"
            name="neighborhood"
            placeholder="Centro"
            value={formData.neighborhood || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.neighborhood} />

          <Input
            label="CEP"
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder="00000-000"
            value={formData.zipCode || ''}
            onChange={handleChange}
            required
          />
          <ErrorMessage message={errors.zipCode} />

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
            value={formData.city || ''}
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
              value={formData.description || ''}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <ErrorMessage message={errors.description} />

          {/* Facilidades (Checkbox Group) */}
          <div className="input-group">
            <label className="input-label">Facilidades Oferecidas</label>
            <div className="checkbox-group">
              {commonFacilities.map((facility) => (
                <label key={facility}>
                  <input
                    type="checkbox"
                    name="facilities"
                    value={facility}
                    checked={formData.facilities.includes(facility)}
                    onChange={handleChange}
                  />
                  {facility}
                </label>
              ))}
            </div>
          </div>

          {/* Botão de Cadastro */}
          <Button type="submit" className="button-primary" disabled={loading}>
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
