// src/pages/CompleteManagerProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import GerenteService from '../../services/GerenteService';
import { isValidCPF } from '../../utils/documentValidators';

import '../../styles/pages/_register.css';
import logo from '../../assets/logoFundo.png';

const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const formatDate = (value) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
};

function CompleteManagerProfile() {
  const navigate = useNavigate();

  const [gerenteData, setGerenteData] = useState({
    cpf: '',
    telefone: '',
    dataNascimento: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!gerenteData.cpf.trim()) {
      newErrors.cpf = 'O CPF é obrigatório.';
      isValid = false;
    } else if (gerenteData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'O CPF deve conter 11 dígitos.';
      isValid = false;
    } else if (!isValidCPF(gerenteData.cpf)) {
      newErrors.cpf = 'Informe um CPF válido.';
      isValid = false;
    }

    if (!gerenteData.telefone.trim()) {
      newErrors.telefone = 'O telefone é obrigatório.';
      isValid = false;
    } else if (gerenteData.telefone.length !== 15) {
      newErrors.telefone = 'Telefone incompleto.';
      isValid = false;
    }

    if (gerenteData.dataNascimento.length !== 10) {
      newErrors.dataNascimento = 'Data incompleta (DD/MM/AAAA).';
      isValid = false;
    } else {
      const [dia, mes, ano] = gerenteData.dataNascimento.split('/').map(Number);
      const dataNasc = new Date(ano, mes - 1, dia);
      const hoje = new Date();

      if (
        dataNasc.getFullYear() !== ano ||
        dataNasc.getMonth() !== mes - 1 ||
        dataNasc.getDate() !== dia
      ) {
        newErrors.dataNascimento = 'Esta data de nascimento não existe.';
        isValid = false;
      } else {
        let idade = hoje.getFullYear() - dataNasc.getFullYear();
        const mesDiferenca = hoje.getMonth() - dataNasc.getMonth();

        if (
          mesDiferenca < 0 ||
          (mesDiferenca === 0 && hoje.getDate() < dataNasc.getDate())
        ) {
          idade--;
        }

        if (idade < 18) {
          newErrors.dataNascimento = 'Você precisa ter pelo menos 18 anos para se cadastrar.';
          isValid = false;
        } else if (idade > 120) {
          newErrors.dataNascimento = 'Por favor, insira uma data válida.';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (name === 'dataNascimento') {
      formattedValue = formatDate(value);
    }

    setGerenteData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (apiMessage) {
      setApiMessage('');
    }
  };

  const convertDateToApi = (date) => {
    const [dia, mes, ano] = date.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const tratarMensagemErro = (error) => {
    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      'Erro ao completar cadastro de gerente.';

    const mensagemTexto = String(mensagemErro);

    if (
      mensagemTexto.includes('CPF') ||
      mensagemTexto.includes('cpf') ||
      mensagemTexto.includes('UQ_Gerente_CPF')
    ) {
      return 'Já existe um gerente cadastrado com este CPF.';
    }

    if (
      mensagemTexto.includes('usuário já possui cadastro') ||
      mensagemTexto.includes('Este usuário já possui cadastro de gerente') ||
      mensagemTexto.includes('UQ_Gerente_Usuario')
    ) {
      return 'Este usuário já possui cadastro de gerente.';
    }

    if (mensagemTexto.includes('CPF inválido')) {
      return 'CPF inválido.';
    }

    if (mensagemTexto.includes('Usuário não encontrado')) {
      return 'Usuário não encontrado.';
    }

    if (mensagemTexto.includes('permissão de gerente')) {
      return 'Este usuário não possui permissão de gerente.';
    }

    return mensagemTexto;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (!validateForm()) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    const usuarioLogado = JSON.parse(localStorage.getItem('user'));

    if (!usuarioLogado?.id) {
      setApiMessage('Erro: usuário logado não encontrado.');
      setLoading(false);
      return;
    }

    const payload = {
      cpf: gerenteData.cpf.replace(/\D/g, ''),
      telefone: gerenteData.telefone,
      dataNascimento: convertDateToApi(gerenteData.dataNascimento),
      usuario: {
        id: usuarioLogado.id
      }
    };

    try {
      const response = await GerenteService.create(payload);

      localStorage.setItem('gerente', JSON.stringify(response.data));

      setApiMessage('Cadastro de gerente concluído com sucesso!');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Erro ao completar cadastro de gerente:', error);

      const mensagemTratada = tratarMensagemErro(error);
      setApiMessage(`Erro: ${mensagemTratada}`);
    } finally {
      setLoading(false);
    }
  };

  const apiMessageClassName = apiMessage.startsWith('Erro')
    ? 'manager-form-message manager-form-message-error'
    : 'manager-form-message manager-form-message-success';

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="register-header">
          <img src={logo} alt="Logo da LOGYM" className="register-logo" />

          <h1>Completar Cadastro</h1>

          <p className="manager-complete-description">
            Só mais alguns dados para liberar o seu acesso.
          </p>
        </div>

        {apiMessage && (
          <p className={apiMessageClassName}>
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="CPF"
            name="cpf"
            placeholder="000.000.000-00"
            value={gerenteData.cpf}
            onChange={handleChange}
            maxLength="14"
            required
          />
          <ErrorMessage message={errors.cpf} />

          <Input
            label="Telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            value={gerenteData.telefone}
            onChange={handleChange}
            maxLength="15"
            required
          />
          <ErrorMessage message={errors.telefone} />

          <Input
            label="Data de Nascimento"
            type="text"
            name="dataNascimento"
            placeholder="DD/MM/AAAA"
            value={gerenteData.dataNascimento}
            onChange={handleChange}
            maxLength="10"
            required
          />
          <ErrorMessage message={errors.dataNascimento} />

          <Button
            type="submit"
            className="button-primary manager-complete-submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Concluir Cadastro'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CompleteManagerProfile;
