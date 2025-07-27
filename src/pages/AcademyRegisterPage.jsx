// src/pages/AcademyRegisterPage.jsx
import React, { useState } from 'react';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { Link } from 'react-router-dom';

// Lista de estados e cidades (simplificada para demonstração)
const states = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' }, { uf: 'RS', name: 'Rio Grande do Sul' },
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
    cnpj: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    description: '',
    facilities: [] // Array para as facilidades selecionadas
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados da Academia para Cadastro:', formData);
    alert('Cadastro de academia em andamento! Verifique o console para os dados.');
    // Aqui você fará a chamada para sua API para cadastrar a academia
  };

  return (
    <div className="academy-register-page">
      <div className="academy-register-form-container">
        <h1>Cadastrar Nova Academia</h1>
        <form onSubmit={handleSubmit}>
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
          <Input
            label="CNPJ"
            type="text"
            id="cnpj"
            name="cnpj"
            placeholder="Ex: 00.000.000/0000-00"
            value={formData.cnpj}
            onChange={handleChange}
            required
          />
          <Input
            label="E-mail de Contato"
            type="email"
            id="email"
            name="email"
            placeholder="contato@suaacademia.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Telefone"
            type="tel"
            id="phone"
            name="phone"
            placeholder="(XX) XXXX-XXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Endereço */}
          <Input
            label="Endereço"
            type="text"
            id="address"
            name="address"
            placeholder="Nome da Rua/Avenida"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            label="Número"
            type="text"
            id="number"
            name="number"
            placeholder="123"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <Input
            label="Bairro"
            type="text"
            id="neighborhood"
            name="neighborhood"
            placeholder="Centro"
            value={formData.neighborhood}
            onChange={handleChange}
            required
          />
          <Input
            label="CEP"
            type="text"
            id="zipCode"
            name="zipCode"
            placeholder="00000-000"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />

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
          <Button type="submit" className="button-primary">
            Cadastrar Academia
          </Button>
        </form>
        <p>
          Quer visualizar as academias? <Link to="/" className="link">Voltar para a Busca</Link>
        </p>
      </div>
    </div>
  );
}

export default AcademyRegisterPage;