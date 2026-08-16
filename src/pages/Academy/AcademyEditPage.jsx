// src/pages/AcademyEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import AcademiaService from '../../services/AcademiaService';
import FotoAcademiaService from '../../services/FotoAcademiaService';
import CategoriaService from '../../services/CategoriaService';
import FacilidadeService from '../../services/FacilidadeService';
import { isValidCNPJ } from '../../utils/documentValidators';

import '../../styles/pages/_academyRegister.css';
import logo from '../../assets/logoFundo.png';

const formatCEP = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 8);
  return rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

const formatCNPJ = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 14);

  return rawValue
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const formatTelefoneFixo = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 10);

  if (rawValue.length <= 2) return rawValue;

  if (rawValue.length <= 6) {
    return rawValue.replace(/^(\d{2})(\d)/, '($1) $2');
  }

  return rawValue.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3');
};

const formatCelular = (value) => {
  const rawValue = String(value || '').replace(/\D/g, '').slice(0, 11);

  if (rawValue.length <= 2) return rawValue;

  if (rawValue.length <= 7) {
    return rawValue.replace(/^(\d{2})(\d)/, '($1) $2');
  }

  return rawValue.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3');
};

const normalizarTexto = (texto) => {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const normalizarId = (idCategoria) => Number(idCategoria);

const getCategoriaIdsSelecionadas = (academia, categoriasAtivas) => {
  if (Array.isArray(academia.categoriaIds) && academia.categoriaIds.length > 0) {
    return academia.categoriaIds.map(normalizarId).filter(Number.isFinite);
  }

  if (!academia.categorias) {
    return [];
  }

  const nomesAntigos = academia.categorias
    .split(',')
    .map((item) => normalizarTexto(item.trim()))
    .filter(Boolean);

  return categoriasAtivas
    .filter((categoria) => nomesAntigos.includes(normalizarTexto(categoria.nome)))
    .map((categoria) => normalizarId(categoria.id))
    .filter(Number.isFinite);
};

const getFacilidadeIdsSelecionadas = (academia, facilidadesAtivas) => {
  if (Array.isArray(academia.facilidadeIds) && academia.facilidadeIds.length > 0) {
    return academia.facilidadeIds.map(normalizarId).filter(Number.isFinite);
  }

  if (!academia.facilidades) {
    return [];
  }

  const nomesAntigos = academia.facilidades
    .split(',')
    .map((item) => normalizarTexto(item.trim()))
    .filter(Boolean);

  return facilidadesAtivas
    .filter((facilidade) => nomesAntigos.includes(normalizarTexto(facilidade.nome)))
    .map((facilidade) => normalizarId(facilidade.id))
    .filter(Number.isFinite);
};

function AcademyEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  const [fotosAtuais, setFotosAtuais] = useState([]);
  const [novasFotos, setNovasFotos] = useState([]);
  const [previewNovasFotos, setPreviewNovasFotos] = useState([]);
  const [salvandoFotos, setSalvandoFotos] = useState(false);
  const [fotoPendenteRemocao, setFotoPendenteRemocao] = useState(null);
  const [removendoFoto, setRemovendoFoto] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoriasMessage, setCategoriasMessage] = useState('');
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [facilidadesMessage, setFacilidadesMessage] = useState('');

  useEffect(() => {
    const fetchAcademia = async () => {
      try {
        setLoading(true);

        const [academiaResponse, fotosResponse, categoriasResponse, facilidadesResponse] = await Promise.all([
          AcademiaService.findById(id),
          FotoAcademiaService.listarPorAcademia(id),
          CategoriaService.findAtivas().catch((error) => {
            console.error('Erro ao carregar categorias:', error);
            setCategoriasMessage('Não foi possível carregar as categorias agora.');
            return { data: [] };
          }),
          FacilidadeService.findAtivas().catch((error) => {
            console.error('Erro ao carregar facilidades:', error);
            setFacilidadesMessage('Não foi possível carregar as facilidades agora.');
            return { data: [] };
          })
        ]);

        const academia = academiaResponse.data;
        const dadosCategorias = categoriasResponse.data;
        const dadosFacilidades = facilidadesResponse.data;
        const categoriasAtivas = Array.isArray(dadosCategorias)
          ? dadosCategorias
          : Array.isArray(dadosCategorias?.content)
            ? dadosCategorias.content
            : [];
        const facilidadesAtivas = Array.isArray(dadosFacilidades)
          ? dadosFacilidades
          : Array.isArray(dadosFacilidades?.content)
            ? dadosFacilidades.content
            : [];

        if (!Array.isArray(dadosCategorias) && !Array.isArray(dadosCategorias?.content)) {
          setCategoriasMessage('Não foi possível carregar as categorias agora.');
        }

        if (!Array.isArray(dadosFacilidades) && !Array.isArray(dadosFacilidades?.content)) {
          setFacilidadesMessage('Não foi possível carregar as facilidades agora.');
        }

        setCategoryOptions(categoriasAtivas);
        setFacilityOptions(facilidadesAtivas);

        setFormData({
          nome: academia.nome || '',
          cnpj: formatCNPJ(academia.cnpj || ''),
          cep: formatCEP(academia.cep || ''),
          endereco: academia.endereco || '',
          numero: academia.numero ? String(academia.numero) : '',
          complemento: academia.complemento || '',
          bairro: academia.bairro || '',
          cidade: academia.cidade || '',
          estado: academia.estado || 'SP',
          telefone: formatTelefoneFixo(academia.telefone || ''),
          celular: formatCelular(academia.celular || ''),
          email: academia.email || '',
          descricao: academia.descricao || '',
          categoriaIds: getCategoriaIdsSelecionadas(academia, categoriasAtivas),
          facilidadeIds: getFacilidadeIdsSelecionadas(academia, facilidadesAtivas)
        });

        setFotosAtuais(Array.isArray(fotosResponse.data) ? fotosResponse.data : []);
      } catch (error) {
        console.error('Erro ao carregar academia:', error);
        setApiMessage('Erro ao carregar dados da academia.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademia();
  }, [id]);

  const carregarFotos = async () => {
    try {
      const response = await FotoAcademiaService.listarPorAcademia(id);
      setFotosAtuais(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      setApiMessage('Erro ao carregar fotos da academia.');
    }
  };

  const buscarEnderecoPorCep = async (cepFormatado) => {
    const cepLimpo = cepFormatado.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErrors((prev) => ({
          ...prev,
          cep: 'CEP não encontrado.'
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado
      }));

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
      setErrors((prev) => ({
        ...prev,
        cep: 'Não foi possível buscar o CEP agora.'
      }));
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'cep') {
      const cepFormatado = formatCEP(value);
      setFormData((prev) => ({ ...prev, cep: cepFormatado }));

      if (cepFormatado.replace(/\D/g, '').length === 8) {
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

  const scrollParaTopoFormulario = () => {
    setTimeout(() => {
      const topoFormulario = document.querySelector('.academy-register-form-container');

      if (topoFormulario) {
        topoFormulario.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 0);
  };

  const handleNovasFotosChange = (e) => {
    const arquivos = Array.from(e.target.files || []);

    if (arquivos.length === 0) {
      setNovasFotos([]);
      setPreviewNovasFotos([]);
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

    setNovasFotos(apenasImagens);

    const previews = apenasImagens.map((arquivo) => URL.createObjectURL(arquivo));
    setPreviewNovasFotos(previews);
  };

  const limparNovasFotosSelecionadas = () => {
    setNovasFotos([]);
    setPreviewNovasFotos([]);

    const inputFotos = document.getElementById('novasFotosAcademia');
    if (inputFotos) {
      inputFotos.value = '';
    }
  };

  const handleAdicionarFotos = async () => {
    if (novasFotos.length === 0) {
      setApiMessage('Selecione pelo menos uma foto para adicionar.');
      return;
    }

    setSalvandoFotos(true);
    setApiMessage('');

    try {
      for (const foto of novasFotos) {
        await FotoAcademiaService.salvar(id, foto);
      }

      limparNovasFotosSelecionadas();

      await carregarFotos();

      setApiMessage('Fotos adicionadas com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar fotos:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao adicionar fotos.';

      setApiMessage(`Erro ao adicionar fotos: ${mensagemErro}`);
    } finally {
      setSalvandoFotos(false);
    }
  };

  const handleRemoverFoto = (fotoId) => {
    setFotoPendenteRemocao(fotoId);
  };

  const cancelarRemocaoFoto = () => {
    setFotoPendenteRemocao(null);
  };

  const confirmarRemocaoFoto = async () => {
    if (!fotoPendenteRemocao || removendoFoto) {
      return;
    }

    setApiMessage('');
    setRemovendoFoto(true);

    try {
      await FotoAcademiaService.inativar(fotoPendenteRemocao);

      setFotosAtuais((prev) => prev.filter((foto) => foto.id !== fotoPendenteRemocao));

      setApiMessage('Foto removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover foto:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao remover foto.';

      setApiMessage(`Erro ao remover foto: ${mensagemErro}`);
    } finally {
      setRemovendoFoto(false);
      setFotoPendenteRemocao(null);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updateData = {
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
        facilidadeIds: formData.facilidadeIds
      };

      await AcademiaService.update(id, updateData);

      setApiMessage('🎉 Alterações salvas com sucesso!');

      setTimeout(() => {
        navigate('/painel-gerente', { replace: true });
      }, 1500);
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Erro ao atualizar academia.';

      setApiMessage(`Erro ao atualizar: ${mensagemErro}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="academy-page-loading">
        Carregando dados...
      </div>
    );
  }

  return (
    <>
      <div className="academy-register-page">
        <div className="academy-register-form-container">
        <div className="academy-register-header">
          <img src={logo} alt="Logo da LOGYM" className="academy-register-logo" />
          <h1>Editar Academia</h1>
        </div>

        {apiMessage && (
          <p className={`academy-api-message ${apiMessage.startsWith('Erro') || apiMessage === 'Selecione apenas arquivos de imagem.' ? 'academy-api-message-error' : 'academy-api-message-success'}`}>
            {apiMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="academy-form-grid">
            <h2 className="academy-form-section-title">Dados da Academia</h2>

            <div className="academy-field-half">
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

            <div className="academy-field-half">
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

            <div className="academy-field-third">
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

            <div className="academy-field-large">
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

            <div className="academy-field-small">
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

            <div className="academy-field-third">
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

            <div className="academy-field-third">
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

            <div className="academy-field-small">
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

            <div className="academy-field-third">
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

            <div className="academy-field-third">
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

            <div className="academy-field-full">
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
                Gerencie as fotos que aparecem na página de detalhes da academia.
              </p>
            </div>

            {fotosAtuais.length === 0 ? (
              <div className="academy-photo-empty-state">
                <div className="academy-photo-empty-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
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

                <strong>Esta academia ainda não possui fotos cadastradas.</strong>
                <span>Adicione imagens abaixo para montar a galeria.</span>
              </div>
            ) : (
              <div className="academy-photo-current-area">
                <div className="academy-photo-preview-title">
                  <h3>Fotos atuais</h3>
                  <span>{fotosAtuais.length} foto(s)</span>
                </div>

                <div className="academy-photo-preview-grid">
                  {fotosAtuais.map((foto, index) => (
                    <div key={foto.id} className="academy-photo-preview-card">
                      <img
                        src={FotoAcademiaService.getImagemUrl(foto.id)}
                        alt={`Foto atual ${index + 1}`}
                        className="academy-photo-preview"
                      />

                      <div className="academy-photo-preview-badge">
                        Foto {index + 1}
                      </div>

                      <button
                        type="button"
                        className="academy-photo-remove-button"
                        onClick={() => handleRemoverFoto(foto.id)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label htmlFor="novasFotosAcademia" className="academy-photo-upload-box">
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
                <strong>Adicionar novas fotos</strong>
                <span>Você pode escolher uma ou várias imagens.</span>
                <small>Formatos aceitos: JPG, PNG ou WEBP.</small>
              </div>

              <input
                type="file"
                id="novasFotosAcademia"
                name="novasFotosAcademia"
                accept="image/*"
                multiple
                onChange={handleNovasFotosChange}
                className="academy-photo-upload-input"
              />
            </label>

            {previewNovasFotos.length > 0 && (
              <div className="academy-photo-preview-area">
                <div className="academy-photo-preview-title">
                  <h3>Prévia das novas fotos</h3>
                  <span>{previewNovasFotos.length} foto(s)</span>
                </div>

                <div className="academy-photo-preview-grid">
                  {previewNovasFotos.map((preview, index) => (
                    <div key={index} className="academy-photo-preview-card">
                      <img
                        src={preview}
                        alt={`Prévia ${index + 1}`}
                        className="academy-photo-preview"
                      />

                      <div className="academy-photo-preview-badge">
                        Nova {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="academy-photo-edit-actions">
                  <Button
                    type="button"
                    className="button-primary"
                    onClick={handleAdicionarFotos}
                    disabled={salvandoFotos}
                  >
                    {salvandoFotos ? 'Adicionando fotos...' : 'Adicionar Fotos'}
                  </Button>

                  <Button
                    type="button"
                    className="button-cancel"
                    onClick={limparNovasFotosSelecionadas}
                    disabled={salvandoFotos}
                  >
                    Limpar Seleção
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="academy-form-actions">
            <Button type="submit" className="button-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

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

      <ConfirmModal
        open={Boolean(fotoPendenteRemocao)}
        title="Remover foto"
        message="Tem certeza que deseja remover esta foto? Ela não aparecerá mais nos detalhes da academia."
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        loading={removendoFoto}
        onConfirm={confirmarRemocaoFoto}
        onCancel={cancelarRemocaoFoto}
      />
    </>
  );
}

export default AcademyEditPage;


