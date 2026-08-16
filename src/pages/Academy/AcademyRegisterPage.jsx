// src/pages/AcademyRegisterPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import AcademiaService from '../../services/AcademiaService';
import GerenteService from '../../services/GerenteService';
import CategoriaService from '../../services/CategoriaService';
import FacilidadeService from '../../services/FacilidadeService';
import { isValidCNPJ } from '../../utils/documentValidators';
import FotoAcademiaService from '../../services/FotoAcademiaService';

import '../../styles/pages/_academyRegister.css';
import logo from '../../assets/logoFundo.png';

const formatCEP = (value) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 8);
  return rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

const formatCNPJ = (value) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 14);

  return rawValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const formatTelefoneFixo = (value) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 10);

  if (rawValue.length <= 2) return rawValue;

  if (rawValue.length <= 6) {
    return rawValue.replace(/^(\d{2})(\d)/, '($1) $2');
  }

  return rawValue.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3');
};

const formatCelular = (value) => {
  const rawValue = value.replace(/\D/g, '').slice(0, 11);

  if (rawValue.length <= 2) return rawValue;

  if (rawValue.length <= 7) {
    return rawValue.replace(/^(\d{2})(\d)/, '($1) $2');
  }

  return rawValue.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3');
};

function AcademyRegisterPage() {
  const navigate = useNavigate();

  const [gerenteVerificado, setGerenteVerificado] = useState(false);
  const [gerenteValido, setGerenteValido] = useState(false);
  const [gerenteLogado, setGerenteLogado] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    telefone: '',
    celular: '',
    email: '',
    descricao: '',
    categoriaIds: [],
    facilidadeIds: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [fotosAcademia, setFotosAcademia] = useState([]);
  const [previewFotos, setPreviewFotos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [categoriasMessage, setCategoriasMessage] = useState('');
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [loadingFacilidades, setLoadingFacilidades] = useState(true);
  const [facilidadesMessage, setFacilidadesMessage] = useState('');

  useEffect(() => {
    const verificarGerente = async () => {
      const usuarioLogado = JSON.parse(localStorage.getItem('user'));

      if (!usuarioLogado) {
        navigate('/login', { replace: true });
        return;
      }

      if (usuarioLogado.nivelAcesso !== 'MANAGER') {
        navigate('/', { replace: true });
        return;
      }

      try {
        const response = await GerenteService.findByUsuarioId(usuarioLogado.id);

        if (response.data?.id) {
          localStorage.setItem('gerente', JSON.stringify(response.data));
          setGerenteLogado(response.data);
          setGerenteValido(true);
        } else {
          localStorage.removeItem('gerente');
          setGerenteLogado(null);
          setGerenteValido(false);
        }
      } catch (error) {
        console.error('Cadastro de gerente não encontrado:', error);
        localStorage.removeItem('gerente');
        setGerenteLogado(null);
        setGerenteValido(false);
      } finally {
        setGerenteVerificado(true);
      }
    };

    verificarGerente();
  }, [navigate]);

  useEffect(() => {
    const carregarCategorias = async () => {
      setLoadingCategorias(true);
      setCategoriasMessage('');

      try {
        const response = await CategoriaService.findAtivas();
        const dados = response.data;

        if (Array.isArray(dados)) {
          setCategoryOptions(dados);
        } else if (Array.isArray(dados?.content)) {
          setCategoryOptions(dados.content);
        } else {
          console.error('Resposta inesperada ao carregar categorias:', dados);
          setCategoryOptions([]);
          setCategoriasMessage('Não foi possível carregar as categorias agora.');
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategoryOptions([]);
        setCategoriasMessage('Não foi possível carregar as categorias agora.');
      } finally {
        setLoadingCategorias(false);
      }
    };

    carregarCategorias();
  }, []);

  useEffect(() => {
    const carregarFacilidades = async () => {
      setLoadingFacilidades(true);
      setFacilidadesMessage('');

      try {
        const response = await FacilidadeService.findAtivas();
        const dados = response.data;

        if (Array.isArray(dados)) {
          setFacilityOptions(dados);
        } else if (Array.isArray(dados?.content)) {
          setFacilityOptions(dados.content);
        } else {
          console.error('Resposta inesperada ao carregar facilidades:', dados);
          setFacilityOptions([]);
          setFacilidadesMessage('Não foi possível carregar as facilidades agora.');
        }
      } catch (error) {
        console.error('Erro ao carregar facilidades:', error);
        setFacilityOptions([]);
        setFacilidadesMessage('Não foi possível carregar as facilidades agora.');
      } finally {
        setLoadingFacilidades(false);
      }
    };

    carregarFacilidades();
  }, []);

  const scrollParaTopoFormulario = () => {
    setTimeout(() => {
      const topoFormulario = document.getElementById('academy-register-top');

      if (topoFormulario) {
        topoFormulario.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const getFieldErrorClass = (fieldName) => {
    return errors[fieldName] ? 'field-has-error' : '';
  };

  const limparCamposEndereco = () => {
    setFormData((prev) => ({
      ...prev,
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }));
  };

  const buscarEnderecoPorCep = async (cepFormatado) => {
    const cepLimpo = cepFormatado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      limparCamposEndereco();
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        limparCamposEndereco();

        setErrors((prev) => ({
          ...prev,
          cep: 'CEP não encontrado.'
        }));

        scrollParaTopoFormulario();
        return;
      }

      setFormData((prev) => {
        const cepAtual = prev.cep.replace(/\D/g, '');

        if (cepAtual !== cepLimpo) {
          return prev;
        }

        return {
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        };
      });

      setErrors((prev) => ({
        ...prev,
        cep: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: ''
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);

      limparCamposEndereco();

      setErrors((prev) => ({
        ...prev,
        cep: 'Não foi possível buscar o CEP agora.'
      }));

      scrollParaTopoFormulario();
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (apiMessage) {
      setApiMessage('');
    }

    if (name === 'cep') {
      const cepFormatado = formatCEP(value);
      const cepLimpo = cepFormatado.replace(/\D/g, '');

      setFormData((prev) => {
        if (cepLimpo.length < 8) {
          return {
            ...prev,
            cep: cepFormatado,
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: ''
          };
        }

        return {
          ...prev,
          cep: cepFormatado
        };
      });

      if (cepLimpo.length < 8) {
        setErrors((prev) => ({
          ...prev,
          cep: '',
          endereco: '',
          bairro: '',
          cidade: '',
          estado: ''
        }));

        return;
      }

      if (cepLimpo.length === 8) {
        buscarEnderecoPorCep(cepFormatado);
      }

      return;
    }

    if (name === 'cnpj') {
      setFormData((prev) => ({ ...prev, cnpj: formatCNPJ(value) }));
      return;
    }

    if (name === 'telefone') {
      setFormData((prev) => ({ ...prev, telefone: formatTelefoneFixo(value) }));
      return;
    }

    if (name === 'celular') {
      setFormData((prev) => ({ ...prev, celular: formatCelular(value) }));
      return;
    }

    if (name === 'numero') {
      const apenasNumeros = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, numero: apenasNumeros }));
      return;
    }

    if (name === 'estado') {
      setFormData((prev) => ({ ...prev, estado: value.toUpperCase().slice(0, 2) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type, value) => {
    setFormData((prev) => {
      const currentValues = prev[type];

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [type]: currentValues.filter((item) => item !== value)
        };
      }

      return {
        ...prev,
        [type]: [...currentValues, value]
      };
    });
  };

  const normalizarId = (idCategoria) => Number(idCategoria);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome da academia é obrigatório.';
      isValid = false;
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'O CNPJ é obrigatório.';
      isValid = false;
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'O CNPJ deve conter 14 dígitos.';
      isValid = false;
    } else if (!isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'Informe um CNPJ válido.';
      isValid = false;
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'O CEP é obrigatório.';
      isValid = false;
    } else if (formData.cep.length !== 9) {
      newErrors.cep = 'O CEP deve conter 8 dígitos.';
      isValid = false;
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'O endereço é obrigatório.';
      isValid = false;
    }

    if (!formData.numero.trim()) {
      newErrors.numero = 'O número é obrigatório.';
      isValid = false;
    }

    if (!formData.bairro.trim()) {
      newErrors.bairro = 'O bairro é obrigatório.';
      isValid = false;
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'A cidade é obrigatória.';
      isValid = false;
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'O estado é obrigatório.';
      isValid = false;
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'O telefone é obrigatório.';
      isValid = false;
    } else if (formData.telefone.replace(/\D/g, '').length !== 10) {
      newErrors.telefone = 'Informe um telefone fixo válido com DDD.';
      isValid = false;
    }

    if (formData.celular && formData.celular.replace(/\D/g, '').length !== 11) {
      newErrors.celular = 'Informe um celular válido com DDD.';
      isValid = false;
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFotosChange = (e) => {
    const arquivos = Array.from(e.target.files || []);

    if (arquivos.length === 0) {
      setFotosAcademia([]);
      setPreviewFotos([]);
      return;
    }

    const apenasImagens = arquivos.filter((arquivo) =>
      arquivo.type.startsWith('image/')
    );

    if (apenasImagens.length !== arquivos.length) {
      setApiMessage('Selecione apenas arquivos de imagem.');
      scrollParaTopoFormulario();
    } else if (apiMessage === 'Selecione apenas arquivos de imagem.') {
      setApiMessage('');
    }

    setFotosAcademia(apenasImagens);

    const previews = apenasImagens.map((arquivo) => URL.createObjectURL(arquivo));
    setPreviewFotos(previews);
  };

  const tratarMensagemErro = (error) => {
    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      'Erro ao cadastrar academia.';

    const texto = String(mensagemErro);

    if (
      texto.includes('CNPJ') ||
      texto.includes('cnpj') ||
      texto.includes('UQ_Academia_CNPJ')
    ) {
      return 'Já existe uma academia cadastrada com este CNPJ.';
    }

    return texto;
  };

  const aplicarErroDoBackendNosCampos = (mensagemTratada) => {
    const texto = String(mensagemTratada);

    if (texto.includes('CNPJ') || texto.includes('cnpj')) {
      setErrors((prev) => ({
        ...prev,
        cnpj: mensagemTratada
      }));
    }

    if (texto.includes('CEP') || texto.includes('cep')) {
      setErrors((prev) => ({
        ...prev,
        cep: mensagemTratada
      }));
    }

    if (texto.includes('telefone') || texto.includes('Telefone')) {
      setErrors((prev) => ({
        ...prev,
        telefone: mensagemTratada
      }));
    }

    if (texto.includes('celular') || texto.includes('Celular')) {
      setErrors((prev) => ({
        ...prev,
        celular: mensagemTratada
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (salvando) return;

    if (!gerenteLogado?.id) {
      setApiMessage('Erro: finalize seu cadastro de gerente antes de cadastrar academias.');
      scrollParaTopoFormulario();
      return;
    }

    if (!validateForm()) {
      setApiMessage('Erro: verifique os campos destacados antes de continuar.');
      scrollParaTopoFormulario();
      return;
    }

    setSalvando(true);
    setLoading(true);

    try {
      const academiaData = {
        nome: formData.nome,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
        endereco: formData.endereco,
        numero: Number(formData.numero),
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        telefone: formData.telefone,
        celular: formData.celular,
        email: formData.email,
        descricao: formData.descricao,
        categoriaIds: formData.categoriaIds,
        facilidadeIds: formData.facilidadeIds,
        gerente: {
          id: gerenteLogado.id
        }
      };

      const response = await AcademiaService.create(academiaData);
      const academiaCriada = response.data;

      if (fotosAcademia.length > 0) {
        for (const foto of fotosAcademia) {
          await FotoAcademiaService.salvar(academiaCriada.id, foto);
        }
      }

      setApiMessage(`🎉 Academia ${academiaCriada.nome} cadastrada com sucesso! Redirecionando para o painel...`);
      scrollParaTopoFormulario();

      setTimeout(() => {
        navigate('/painel-gerente', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar academia:', error);

      const mensagemTratada = tratarMensagemErro(error);

      aplicarErroDoBackendNosCampos(mensagemTratada);
      setApiMessage(`Erro: ${mensagemTratada}`);
      scrollParaTopoFormulario();
    } finally {
      setSalvando(false);
      setLoading(false);
    }
  };

  if (!gerenteVerificado) {
    return (
      <div className="academy-page-loading">
        Verificando cadastro de gerente...
      </div>
    );
  }

  if (!gerenteValido) {
    return (
      <div className="academy-register-page academy-manager-warning-page">
        <div className="academy-manager-warning-card">
          <div className="academy-manager-warning-icon">
            !
          </div>

          <h1 className="academy-manager-warning-title">
            Cadastro de Gerente Incompleto
          </h1>

          <p className="academy-manager-warning-text">
            Para cadastrar uma academia, primeiro finalize seu cadastro de gerente.
            Depois disso, o formulário será liberado normalmente.
          </p>

          <div className="academy-manager-warning-actions">
            <Button
              type="button"
              className="button-primary academy-manager-warning-button"
              onClick={() => navigate('/completar-cadastro-gerente')}
            >
              Completar Cadastro de Gerente
            </Button>

            <Button
              type="button"
              className="button-cancel academy-manager-warning-button"
              onClick={() => navigate('/')}
            >
              Voltar para Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="academy-register-page">
      <div className="academy-register-form-container" id="academy-register-top">
        <div className="academy-register-header">
          <img src={logo} alt="Logo da LOGYM" className="academy-register-logo" />
          <h1>Cadastrar Nova Academia</h1>
        </div>

        {apiMessage && (
          <p className={`academy-api-message ${apiMessage.startsWith('Erro') || apiMessage === 'Selecione apenas arquivos de imagem.' ? 'academy-api-message-error' : 'academy-api-message-success'}`}>
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="academy-form-grid">
            <h2 className="academy-form-section-title">Dados da Academia</h2>

            <div className={`academy-field-half ${getFieldErrorClass('nome')}`}>
              <Input
                label="Nome da Academia"
                type="text"
                id="nome"
                name="nome"
                placeholder="Ex: Academia Fitness Total"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <ErrorMessage message={errors.nome} />
            </div>

            <div className={`academy-field-half ${getFieldErrorClass('cnpj')}`}>
              <Input
                label="CNPJ"
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="Ex: 00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleChange}
                maxLength="18"
                required
              />
              <ErrorMessage message={errors.cnpj} />
            </div>

            <h2 className="academy-form-section-title">Endereço</h2>

            <div className={`academy-field-third ${getFieldErrorClass('cep')}`}>
              <Input
                label={buscandoCep ? 'CEP - buscando endereço...' : 'CEP'}
                type="text"
                id="cep"
                name="cep"
                placeholder="Ex: 06400-000"
                value={formData.cep}
                onChange={handleChange}
                maxLength="9"
                required
              />
              <ErrorMessage message={errors.cep} />
            </div>

            <div className={`academy-field-large ${getFieldErrorClass('endereco')}`}>
              <Input
                label="Endereço"
                type="text"
                id="endereco"
                name="endereco"
                placeholder="Ex: Avenida Paulista"
                value={formData.endereco}
                onChange={handleChange}
                required
              />
              <ErrorMessage message={errors.endereco} />
            </div>

            <div className={`academy-field-small ${getFieldErrorClass('numero')}`}>
              <Input
                label="Número"
                type="text"
                id="numero"
                name="numero"
                placeholder="Ex: 123"
                value={formData.numero}
                onChange={handleChange}
                required
              />
              <ErrorMessage message={errors.numero} />
            </div>

            <div className="academy-field-third">
              <Input
                label="Complemento"
                type="text"
                id="complemento"
                name="complemento"
                placeholder="Ex: Loja 2, Sala 10"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>

            <div className={`academy-field-third ${getFieldErrorClass('bairro')}`}>
              <Input
                label="Bairro"
                type="text"
                id="bairro"
                name="bairro"
                placeholder="Ex: Centro"
                value={formData.bairro}
                onChange={handleChange}
                required
              />
              <ErrorMessage message={errors.bairro} />
            </div>

            <div className={`academy-field-third ${getFieldErrorClass('cidade')}`}>
              <Input
                label="Cidade"
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Ex: Barueri"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
              <ErrorMessage message={errors.cidade} />
            </div>

            <div className={`academy-field-small ${getFieldErrorClass('estado')}`}>
              <Input
                label="Estado"
                type="text"
                id="estado"
                name="estado"
                placeholder="Ex: SP"
                value={formData.estado}
                onChange={handleChange}
                maxLength="2"
                required
              />
              <ErrorMessage message={errors.estado} />
            </div>

            <h2 className="academy-form-section-title">Contato</h2>

            <div className={`academy-field-third ${getFieldErrorClass('telefone')}`}>
              <Input
                label="Telefone"
                type="text"
                id="telefone"
                name="telefone"
                placeholder="Ex: (11) 4002-8922"
                value={formData.telefone}
                onChange={handleChange}
                maxLength="14"
                required
              />
              <ErrorMessage message={errors.telefone} />
            </div>

            <div className={`academy-field-third ${getFieldErrorClass('celular')}`}>
              <Input
                label="Celular"
                type="text"
                id="celular"
                name="celular"
                placeholder="Ex: (11) 99999-9999"
                value={formData.celular}
                onChange={handleChange}
                maxLength="15"
              />
              <ErrorMessage message={errors.celular} />
            </div>

            <div className="academy-field-third">
              <Input
                label="E-mail da Academia"
                type="email"
                id="email"
                name="email"
                placeholder="Ex: contato@academia.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <h2 className="academy-form-section-title">Descrição</h2>

            <div className={`academy-field-full ${getFieldErrorClass('descricao')}`}>
              <div className="input-group">
                <label htmlFor="descricao" className="input-label">
                  Descrição da Academia
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  className="textarea-field"
                  rows="5"
                  placeholder="Descreva os diferenciais, estrutura e serviços da academia."
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                />
              </div>
              <ErrorMessage message={errors.descricao} />
            </div>
          </div>

          <div className="checkbox-section">
            <h3>Categorias</h3>
            <p>Selecione as modalidades oferecidas pela academia.</p>

            <div className="checkbox-grid-improved">
              {categoryOptions.map((category) => (
                <label key={category.id} className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={formData.categoriaIds.includes(normalizarId(category.id))}
                    onChange={() => handleCheckboxChange('categoriaIds', normalizarId(category.id))}
                  />
                  <span>{category.nome}</span>
                </label>
              ))}
            </div>

            {loadingCategorias && (
              <p className="academy-checkbox-message">Carregando categorias...</p>
            )}

            {categoriasMessage && (
              <p className="academy-checkbox-message academy-checkbox-message-error">
                {categoriasMessage}
              </p>
            )}
          </div>

          <div className="checkbox-section">
            <h3>Facilidades</h3>
            <p>Selecione os recursos disponíveis na academia.</p>

            <div className="checkbox-grid-improved">
              {facilityOptions.map((facility) => (
                <label key={facility.id} className="checkbox-card">
                  <input
                    type="checkbox"
                    checked={formData.facilidadeIds.includes(normalizarId(facility.id))}
                    onChange={() => handleCheckboxChange('facilidadeIds', normalizarId(facility.id))}
                  />
                  <span>{facility.nome}</span>
                </label>
              ))}
            </div>

            {loadingFacilidades && (
              <p className="academy-checkbox-message">Carregando facilidades...</p>
            )}

            {facilidadesMessage && (
              <p className="academy-checkbox-message academy-checkbox-message-error">
                {facilidadesMessage}
              </p>
            )}
          </div>

          <div className="academy-photo-upload-section">
            <div className="academy-photo-upload-header">
              <h2>Fotos da Academia</h2>
              <p>
                Adicione imagens da academia para aparecerem na página de detalhes.
              </p>
            </div>

            <label htmlFor="fotosAcademia" className="academy-photo-upload-box">
              <div className="academy-photo-upload-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>

              <div className="academy-photo-upload-text">
                <strong>Selecionar fotos da academia</strong>
                <span>Você pode escolher uma ou várias imagens.</span>
                <small>Formatos aceitos: JPG, PNG ou WEBP.</small>
              </div>

              <input
                type="file"
                id="fotosAcademia"
                name="fotosAcademia"
                accept="image/*"
                multiple
                onChange={handleFotosChange}
                className="academy-photo-upload-input"
              />
            </label>

            {previewFotos.length > 0 && (
              <div className="academy-photo-preview-area">
                <div className="academy-photo-preview-title">
                  <h3>Prévia das fotos selecionadas</h3>
                  <span>{previewFotos.length} foto(s)</span>
                </div>

                <div className="academy-photo-preview-grid">
                  {previewFotos.map((preview, index) => (
                    <div key={index} className="academy-photo-preview-card">
                      <img
                        src={preview}
                        alt={`Prévia ${index + 1}`}
                        className="academy-photo-preview"
                      />

                      <div className="academy-photo-preview-badge">
                        Foto {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="academy-form-actions">
            <button
              type="submit"
              className="button-primary"
              disabled={salvando || loading}
            >
              {salvando ? 'Cadastrando...' : 'Cadastrar Academia'}
            </button>

            <Button
              type="button"
              onClick={() => navigate('/painel-gerente')}
              className="button-cancel"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AcademyRegisterPage;


