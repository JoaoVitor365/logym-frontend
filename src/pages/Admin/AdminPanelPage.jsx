// src/pages/Admin/AdminPanelPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import UsuarioService from '../../services/UsuarioService';
import AcademiaService from '../../services/AcademiaService';
import GerenteService from '../../services/GerenteService';
import AvaliacaoService from '../../services/AvaliacaoService';
import CategoriaService from '../../services/CategoriaService';
import FacilidadeService from '../../services/FacilidadeService';

import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminUsersSection from './AdminUsersSection';
import AdminManagersSection from './AdminManagersSection';
import AdminAcademiesSection from './AdminAcademiesSection';
import AdminReviewsSection from './AdminReviewsSection';
import AdminCategoriesSection from './AdminCategoriesSection';
import AdminFacilitiesSection from './AdminFacilitiesSection';

function AdminPanelPage({ currentUser }) {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');

  const [usuarios, setUsuarios] = useState([]);
  const [academias, setAcademias] = useState([]);
  const [gerentes, setGerentes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [facilidades, setFacilidades] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');
  const [acoesEmAndamento, setAcoesEmAndamento] = useState({});
  const [confirmacao, setConfirmacao] = useState(null);
  const acoesEmAndamentoRef = useRef({});

  useEffect(() => {
    const usuarioLogado = currentUser || JSON.parse(localStorage.getItem('user'));

    if (!usuarioLogado) {
      navigate('/login', { replace: true });
      return;
    }

    if (usuarioLogado.nivelAcesso !== 'ADMIN') {
      navigate('/', { replace: true });
      return;
    }

    carregarDadosAdmin();
  }, [currentUser, navigate]);

  const getAcaoKey = (tipo, id, acao) => `${tipo}-${id}-${acao}`;

  const acaoEstaEmAndamento = (chave) => Boolean(acoesEmAndamento[chave]);

  const abrirConfirmacao = (confirmacaoData) => {
    setConfirmacao(confirmacaoData);
  };

  const fecharConfirmacao = () => {
    setConfirmacao(null);
  };

  const acaoConfirmadaEstaEmAndamento = () => {
    if (!confirmacao) return false;

    return acaoEstaEmAndamento(getAcaoKey(confirmacao.tipo, confirmacao.id, confirmacao.acao));
  };

  const iniciarAcao = (chave) => {
    if (acoesEmAndamentoRef.current[chave]) {
      return false;
    }

    const proximasAcoes = {
      ...acoesEmAndamentoRef.current,
      [chave]: true
    };

    acoesEmAndamentoRef.current = proximasAcoes;
    setAcoesEmAndamento(proximasAcoes);
    return true;
  };

  const finalizarAcao = (chave) => {
    const proximasAcoes = { ...acoesEmAndamentoRef.current };
    delete proximasAcoes[chave];

    acoesEmAndamentoRef.current = proximasAcoes;
    setAcoesEmAndamento(proximasAcoes);
  };

  const atualizarStatusUsuarioLocal = (id, statusUsuario) => {
    setUsuarios((prev) =>
      prev.map((usuario) =>
        usuario.id === id
          ? { ...usuario, statusUsuario }
          : usuario
      )
    );
  };

  const recarregarDadosRelacionadosManager = async () => {
    const cargas = [
      { nome: 'usuarios', carregar: UsuarioService.findAll, setDados: setUsuarios },
      { nome: 'gerentes', carregar: GerenteService.findAll, setDados: setGerentes },
      { nome: 'academias', carregar: AcademiaService.findAllAdmin, setDados: setAcademias }
    ];

    const resultados = await Promise.allSettled(cargas.map((carga) => carga.carregar()));
    const falhas = [];

    resultados.forEach((resultado, index) => {
      const carga = cargas[index];

      if (resultado.status === 'fulfilled') {
        carga.setDados(Array.isArray(resultado.value.data) ? resultado.value.data : []);
        return;
      }

      console.error(`Erro ao recarregar ${carga.nome}:`, resultado.reason);
      falhas.push(carga.nome);
    });

    return falhas;
  };

  const carregarDadosAdmin = async () => {
    setLoading(true);
    setApiMessage('');

    const cargas = [
      { nome: 'usuarios', carregar: UsuarioService.findAll, setDados: setUsuarios },
      { nome: 'academias', carregar: AcademiaService.findAllAdmin, setDados: setAcademias },
      { nome: 'gerentes', carregar: GerenteService.findAll, setDados: setGerentes },
      { nome: 'avaliacoes', carregar: AvaliacaoService.findAllAdmin, setDados: setAvaliacoes },
      { nome: 'categorias', carregar: CategoriaService.findAllAdmin, setDados: setCategorias },
      { nome: 'facilidades', carregar: FacilidadeService.findAllAdmin, setDados: setFacilidades }
    ];

    const resultados = await Promise.allSettled(cargas.map((carga) => carga.carregar()));
    const falhas = [];

    resultados.forEach((resultado, index) => {
      const carga = cargas[index];

      if (resultado.status === 'fulfilled') {
        carga.setDados(Array.isArray(resultado.value.data) ? resultado.value.data : []);
        return;
      }

      console.error(`Erro ao carregar ${carga.nome}:`, resultado.reason);
      carga.setDados([]);
      falhas.push(carga.nome);
    });

    if (falhas.length > 0) {
      setApiMessage(`Erro ao carregar alguns dados do painel: ${falhas.join(', ')}.`);
    }

    setLoading(false);
  };

  const totais = useMemo(() => {
    const usuariosAtivos = usuarios.filter((usuario) => usuario.statusUsuario === 'ATIVO');
    const usuariosInativos = usuarios.filter((usuario) => usuario.statusUsuario === 'INATIVO');
    const usuariosSuspensos = usuarios.filter((usuario) => usuario.statusUsuario === 'SUSPENSO');

    const academiasAtivas = academias.filter((academia) => academia.statusAcademia === 'ATIVO');
    const academiasInativas = academias.filter((academia) => academia.statusAcademia === 'INATIVO');
    const academiasSuspensas = academias.filter((academia) => academia.statusAcademia === 'SUSPENSA');

    const avaliacoesAtivas = avaliacoes.filter((avaliacao) => avaliacao.statusAvaliacao === 'ATIVO');
    const avaliacoesInativas = avaliacoes.filter((avaliacao) => avaliacao.statusAvaliacao === 'INATIVO');
    const avaliacoesSuspensas = avaliacoes.filter((avaliacao) => avaliacao.statusAvaliacao === 'SUSPENSA');

    const categoriasAtivas = categorias.filter((categoria) => categoria.statusCategoria === 'ATIVO');
    const categoriasInativas = categorias.filter((categoria) => categoria.statusCategoria === 'INATIVO');
    const facilidadesAtivas = facilidades.filter((facilidade) => facilidade.statusFacilidade === 'ATIVO');
    const facilidadesInativas = facilidades.filter((facilidade) => facilidade.statusFacilidade === 'INATIVO');

    return {
      usuarios: usuarios.length,
      usuariosAtivos: usuariosAtivos.length,
      usuariosInativos: usuariosInativos.length,
      usuariosSuspensos: usuariosSuspensos.length,

      admins: usuarios.filter((usuario) => usuario.nivelAcesso === 'ADMIN').length,
      users: usuarios.filter((usuario) => usuario.nivelAcesso === 'USER').length,
      managers: usuarios.filter((usuario) => usuario.nivelAcesso === 'MANAGER').length,

      gerentes: gerentes.length,

      academias: academias.length,
      academiasAtivas: academiasAtivas.length,
      academiasInativas: academiasInativas.length,
      academiasSuspensas: academiasSuspensas.length,

      avaliacoes: avaliacoes.length,
      avaliacoesAtivas: avaliacoesAtivas.length,
      avaliacoesInativas: avaliacoesInativas.length,
      avaliacoesSuspensas: avaliacoesSuspensas.length,

      categorias: categorias.length,
      categoriasAtivas: categoriasAtivas.length,
      categoriasInativas: categoriasInativas.length,

      facilidades: facilidades.length,
      facilidadesAtivas: facilidadesAtivas.length,
      facilidadesInativas: facilidadesInativas.length
    };
  }, [usuarios, academias, gerentes, avaliacoes, categorias, facilidades]);

  const handleAtivarUsuario = async (id) => {
    abrirConfirmacao({
      tipo: 'usuario',
      acao: 'reativar',
      id,
      title: 'Reativar usuário',
      message: 'Tem certeza que deseja reativar este usuário?',
      confirmText: 'Reativar',
      variant: 'default'
    });
  };

  const executarAtivarUsuario = async (id) => {
    const chaveAcao = getAcaoKey('usuario', id, 'reativar');

    if (!iniciarAcao(chaveAcao)) return;

    const usuarioAlterado = usuarios.find((usuario) => usuario.id === id);
    const ehManager = usuarioAlterado?.nivelAcesso === 'MANAGER';

    try {
      await UsuarioService.ativar(id);

      atualizarStatusUsuarioLocal(id, 'ATIVO');

      if (ehManager) {
        const falhas = await recarregarDadosRelacionadosManager();

        if (falhas.length > 0) {
          setApiMessage(`Usuário reativado com sucesso. Erro ao atualizar dados relacionados: ${falhas.join(', ')}.`);
          return;
        }
      }

      setApiMessage('Usuário reativado com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      setApiMessage('Erro ao reativar usuário.');
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleSuspenderUsuario = async (id) => {
    const usuarioLogado = currentUser || JSON.parse(localStorage.getItem('user'));

    if (usuarioLogado?.id === id) {
      setApiMessage('Erro: você não pode suspender a própria conta ADMIN por aqui.');
      return;
    }

    abrirConfirmacao({
      tipo: 'usuario',
      acao: 'suspender',
      id,
      title: 'Suspender usuário',
      message: 'Tem certeza que deseja suspender este usuário?',
      confirmText: 'Suspender',
      variant: 'danger'
    });
  };

  const executarSuspenderUsuario = async (id) => {
    const chaveAcao = getAcaoKey('usuario', id, 'suspender');

    if (!iniciarAcao(chaveAcao)) return;

    const usuarioAlterado = usuarios.find((usuario) => usuario.id === id);
    const ehManager = usuarioAlterado?.nivelAcesso === 'MANAGER';

    try {
      await UsuarioService.suspender(id);

      atualizarStatusUsuarioLocal(id, 'SUSPENSO');

      if (ehManager) {
        const falhas = await recarregarDadosRelacionadosManager();

        if (falhas.length > 0) {
          setApiMessage(`Usuário suspenso com sucesso. Erro ao atualizar dados relacionados: ${falhas.join(', ')}.`);
          return;
        }
      }

      setApiMessage('Usuário suspenso com sucesso.');
    } catch (error) {
      console.error('Erro ao suspender usuário:', error);
      setApiMessage('Erro ao suspender usuário.');
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleReativarAcademia = async (id) => {
    abrirConfirmacao({
      tipo: 'academia',
      acao: 'reativar',
      id,
      title: 'Reativar academia',
      message: 'Tem certeza que deseja reativar esta academia?',
      confirmText: 'Reativar',
      variant: 'default'
    });
  };

  const executarReativarAcademia = async (id) => {
    const chaveAcao = getAcaoKey('academia', id, 'reativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await AcademiaService.reativarAdmin(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'ATIVO' }
            : academia
        )
      );

      setApiMessage('Academia reativada com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar academia:', error);
      setApiMessage('Erro ao reativar academia.');
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleSuspenderAcademia = async (id) => {
    abrirConfirmacao({
      tipo: 'academia',
      acao: 'suspender',
      id,
      title: 'Suspender academia',
      message: 'Tem certeza que deseja suspender esta academia? O gerente não poderá reativá-la pelo painel dele.',
      confirmText: 'Suspender',
      variant: 'danger'
    });
  };

  const executarSuspenderAcademia = async (id) => {
    const chaveAcao = getAcaoKey('academia', id, 'suspender');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await AcademiaService.suspenderAdmin(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'SUSPENSA' }
            : academia
        )
      );

      setApiMessage('Academia suspensa com sucesso.');
    } catch (error) {
      console.error('Erro ao suspender academia:', error);
      setApiMessage('Erro ao suspender academia.');
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleSuspenderAvaliacao = async (id) => {
    abrirConfirmacao({
      tipo: 'avaliacao',
      acao: 'suspender',
      id,
      title: 'Suspender avaliação',
      message: 'Tem certeza que deseja suspender esta avaliação? Ela não aparecerá para outros usuários e não contará na média da academia.',
      confirmText: 'Suspender',
      variant: 'danger'
    });
  };

  const executarSuspenderAvaliacao = async (id) => {
    const chaveAcao = getAcaoKey('avaliacao', id, 'suspender');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      const response = await AvaliacaoService.suspenderAdmin(id);
      const avaliacaoAtualizada = response.data;

      setAvaliacoes((prev) =>
        prev.map((avaliacao) =>
          avaliacao.id === id
            ? { ...avaliacao, ...avaliacaoAtualizada, statusAvaliacao: 'SUSPENSA' }
            : avaliacao
        )
      );

      await recarregarAcademiasAdmin();
      setApiMessage('Avaliação suspensa com sucesso.');
    } catch (error) {
      console.error('Erro ao suspender avaliação:', error);
      setApiMessage('Erro ao suspender avaliação.');
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleReativarAvaliacao = async (id) => {
    abrirConfirmacao({
      tipo: 'avaliacao',
      acao: 'reativar',
      id,
      title: 'Reativar avaliação',
      message: 'Tem certeza que deseja reativar esta avaliação? Ela voltará a aparecer e contará na média da academia.',
      confirmText: 'Reativar',
      variant: 'default'
    });
  };

  const executarReativarAvaliacao = async (id) => {
    const chaveAcao = getAcaoKey('avaliacao', id, 'reativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      const response = await AvaliacaoService.reativarAdmin(id);
      const avaliacaoAtualizada = response.data;

      setAvaliacoes((prev) =>
        prev.map((avaliacao) =>
          avaliacao.id === id
            ? { ...avaliacao, ...avaliacaoAtualizada, statusAvaliacao: 'ATIVO' }
            : avaliacao
        )
      );

      await recarregarAcademiasAdmin();
      setApiMessage('Avaliação reativada com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar avaliação:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao reativar avaliação.';

      setApiMessage(`Erro: ${mensagemErro}`);
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const getMensagemErroCategoria = (error, fallback) => {
    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      fallback;

    return String(mensagemErro);
  };

  const recarregarCategoriasAdmin = async () => {
    const response = await CategoriaService.findAllAdmin();
    setCategorias(Array.isArray(response.data) ? response.data : []);
  };

  const handleCadastrarCategoria = async (categoriaData) => {
    const chaveAcao = getAcaoKey('categoria', 'nova', 'cadastrar');

    if (!iniciarAcao(chaveAcao)) return false;

    try {
      await CategoriaService.create(categoriaData);
      await recarregarCategoriasAdmin();
      setApiMessage('Categoria cadastrada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      setApiMessage(`Erro: ${getMensagemErroCategoria(error, 'Erro ao cadastrar categoria.')}`);
      return false;
    } finally {
      finalizarAcao(chaveAcao);
    }
  };

  const handleEditarCategoria = async (id, categoriaData) => {
    const chaveAcao = getAcaoKey('categoria', id, 'editar');

    if (!iniciarAcao(chaveAcao)) return false;

    try {
      await CategoriaService.update(id, categoriaData);
      await recarregarCategoriasAdmin();
      setApiMessage('Categoria atualizada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      setApiMessage(`Erro: ${getMensagemErroCategoria(error, 'Erro ao editar categoria.')}`);
      return false;
    } finally {
      finalizarAcao(chaveAcao);
    }
  };

  const handleInativarCategoria = async (id) => {
    abrirConfirmacao({
      tipo: 'categoria',
      acao: 'inativar',
      id,
      title: 'Inativar categoria',
      message: 'Tem certeza que deseja inativar esta categoria?',
      confirmText: 'Inativar',
      variant: 'danger'
    });
  };

  const executarInativarCategoria = async (id) => {
    const chaveAcao = getAcaoKey('categoria', id, 'inativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await CategoriaService.inativar(id);
      await recarregarCategoriasAdmin();
      setApiMessage('Categoria inativada com sucesso.');
    } catch (error) {
      console.error('Erro ao inativar categoria:', error);
      setApiMessage(`Erro: ${getMensagemErroCategoria(error, 'Erro ao inativar categoria.')}`);
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleReativarCategoria = async (id) => {
    abrirConfirmacao({
      tipo: 'categoria',
      acao: 'reativar',
      id,
      title: 'Reativar categoria',
      message: 'Tem certeza que deseja reativar esta categoria?',
      confirmText: 'Reativar',
      variant: 'default'
    });
  };

  const executarReativarCategoria = async (id) => {
    const chaveAcao = getAcaoKey('categoria', id, 'reativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await CategoriaService.reativar(id);
      await recarregarCategoriasAdmin();
      setApiMessage('Categoria reativada com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar categoria:', error);
      setApiMessage(`Erro: ${getMensagemErroCategoria(error, 'Erro ao reativar categoria.')}`);
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const getMensagemErroFacilidade = (error, fallback) => {
    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      fallback;

    return String(mensagemErro);
  };

  const recarregarFacilidadesAdmin = async () => {
    const response = await FacilidadeService.findAllAdmin();
    setFacilidades(Array.isArray(response.data) ? response.data : []);
  };

  const handleCadastrarFacilidade = async (facilidadeData) => {
    const chaveAcao = getAcaoKey('facilidade', 'nova', 'cadastrar');

    if (!iniciarAcao(chaveAcao)) return false;

    try {
      await FacilidadeService.create(facilidadeData);
      await recarregarFacilidadesAdmin();
      setApiMessage('Facilidade cadastrada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao cadastrar facilidade:', error);
      setApiMessage(`Erro: ${getMensagemErroFacilidade(error, 'Erro ao cadastrar facilidade.')}`);
      return false;
    } finally {
      finalizarAcao(chaveAcao);
    }
  };

  const handleEditarFacilidade = async (id, facilidadeData) => {
    const chaveAcao = getAcaoKey('facilidade', id, 'editar');

    if (!iniciarAcao(chaveAcao)) return false;

    try {
      await FacilidadeService.update(id, facilidadeData);
      await recarregarFacilidadesAdmin();
      setApiMessage('Facilidade atualizada com sucesso.');
      return true;
    } catch (error) {
      console.error('Erro ao editar facilidade:', error);
      setApiMessage(`Erro: ${getMensagemErroFacilidade(error, 'Erro ao editar facilidade.')}`);
      return false;
    } finally {
      finalizarAcao(chaveAcao);
    }
  };

  const handleInativarFacilidade = async (id) => {
    abrirConfirmacao({
      tipo: 'facilidade',
      acao: 'inativar',
      id,
      title: 'Inativar facilidade',
      message: 'Tem certeza que deseja inativar esta facilidade?',
      confirmText: 'Inativar',
      variant: 'danger'
    });
  };

  const executarInativarFacilidade = async (id) => {
    const chaveAcao = getAcaoKey('facilidade', id, 'inativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await FacilidadeService.inativar(id);
      await recarregarFacilidadesAdmin();
      setApiMessage('Facilidade inativada com sucesso.');
    } catch (error) {
      console.error('Erro ao inativar facilidade:', error);
      setApiMessage(`Erro: ${getMensagemErroFacilidade(error, 'Erro ao inativar facilidade.')}`);
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const handleReativarFacilidade = async (id) => {
    abrirConfirmacao({
      tipo: 'facilidade',
      acao: 'reativar',
      id,
      title: 'Reativar facilidade',
      message: 'Tem certeza que deseja reativar esta facilidade?',
      confirmText: 'Reativar',
      variant: 'default'
    });
  };

  const executarReativarFacilidade = async (id) => {
    const chaveAcao = getAcaoKey('facilidade', id, 'reativar');

    if (!iniciarAcao(chaveAcao)) return;

    try {
      await FacilidadeService.reativar(id);
      await recarregarFacilidadesAdmin();
      setApiMessage('Facilidade reativada com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar facilidade:', error);
      setApiMessage(`Erro: ${getMensagemErroFacilidade(error, 'Erro ao reativar facilidade.')}`);
    } finally {
      finalizarAcao(chaveAcao);
      fecharConfirmacao();
    }
  };

  const recarregarAcademiasAdmin = async () => {
    const response = await AcademiaService.findAllAdmin();
    setAcademias(Array.isArray(response.data) ? response.data : []);
  };

  const handleConfirmarAcao = async () => {
    if (!confirmacao) return;

    const { tipo, acao, id } = confirmacao;

    if (tipo === 'usuario' && acao === 'reativar') {
      await executarAtivarUsuario(id);
      return;
    }

    if (tipo === 'usuario' && acao === 'suspender') {
      await executarSuspenderUsuario(id);
      return;
    }

    if (tipo === 'academia' && acao === 'reativar') {
      await executarReativarAcademia(id);
      return;
    }

    if (tipo === 'academia' && acao === 'suspender') {
      await executarSuspenderAcademia(id);
      return;
    }

    if (tipo === 'avaliacao' && acao === 'suspender') {
      await executarSuspenderAvaliacao(id);
      return;
    }

    if (tipo === 'avaliacao' && acao === 'reativar') {
      await executarReativarAvaliacao(id);
      return;
    }

    if (tipo === 'categoria' && acao === 'inativar') {
      await executarInativarCategoria(id);
      return;
    }

    if (tipo === 'categoria' && acao === 'reativar') {
      await executarReativarCategoria(id);
      return;
    }

    if (tipo === 'facilidade' && acao === 'inativar') {
      await executarInativarFacilidade(id);
      return;
    }

    if (tipo === 'facilidade' && acao === 'reativar') {
      await executarReativarFacilidade(id);
    }
  };

  const mudarSecao = (secao) => {
    setActiveSection(secao);
    setApiMessage('');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', description: 'Resumo geral' },
    { id: 'usuarios', label: 'Usuários', description: `${totais.usuarios} cadastro(s)` },
    { id: 'gerentes', label: 'Gerentes', description: `${totais.gerentes} completo(s)` },
    { id: 'academias', label: 'Academias', description: `${totais.academias} cadastro(s)` },
    { id: 'avaliacoes', label: 'Avaliações', description: `${totais.avaliacoes} registro(s)` },
    { id: 'categorias', label: 'Categorias', description: `${totais.categorias} cadastro(s)` },
    { id: 'facilidades', label: 'Facilidades', description: `${totais.facilidades} cadastro(s)` }
  ];

  const getTituloSecao = () => {
    const item = menuItems.find((menuItem) => menuItem.id === activeSection);
    return item?.label || 'Dashboard';
  };

  const getDescricaoSecao = () => {
    if (activeSection === 'dashboard') return 'Visão geral dos principais dados administrativos do sistema.';
    if (activeSection === 'usuarios') return 'Gerencie contas comuns, gerentes e administradores cadastrados.';
    if (activeSection === 'gerentes') return 'Consulte os dados dos gerentes que completaram o cadastro.';
    if (activeSection === 'academias') return 'Gerencie academias ativas, inativas e suspensas.';
    if (activeSection === 'avaliacoes') return 'Gerencie avaliações ativas, inativas e suspensas.';
    if (activeSection === 'categorias') return 'Gerencie categorias ativas e inativas.';
    if (activeSection === 'facilidades') return 'Gerencie facilidades ativas e inativas.';
    return '';
  };

  const renderConteudo = () => {
    if (activeSection === 'usuarios') {
      return (
        <AdminUsersSection
          usuarios={usuarios}
          currentUser={currentUser}
          onSuspenderUsuario={handleSuspenderUsuario}
          onAtivarUsuario={handleAtivarUsuario}
          acaoEstaEmAndamento={acaoEstaEmAndamento}
          getAcaoKey={getAcaoKey}
        />
      );
    }

    if (activeSection === 'gerentes') return <AdminManagersSection gerentes={gerentes} />;

    if (activeSection === 'academias') {
      return (
        <AdminAcademiesSection
          academias={academias}
          onSuspenderAcademia={handleSuspenderAcademia}
          onReativarAcademia={handleReativarAcademia}
          acaoEstaEmAndamento={acaoEstaEmAndamento}
          getAcaoKey={getAcaoKey}
        />
      );
    }

    if (activeSection === 'avaliacoes') {
      return (
        <AdminReviewsSection
          avaliacoes={avaliacoes}
          onSuspenderAvaliacao={handleSuspenderAvaliacao}
          onReativarAvaliacao={handleReativarAvaliacao}
          acaoEstaEmAndamento={acaoEstaEmAndamento}
          getAcaoKey={getAcaoKey}
        />
      );
    }

    if (activeSection === 'categorias') {
      return (
        <AdminCategoriesSection
          categorias={categorias}
          onCadastrarCategoria={handleCadastrarCategoria}
          onEditarCategoria={handleEditarCategoria}
          onInativarCategoria={handleInativarCategoria}
          onReativarCategoria={handleReativarCategoria}
          acaoEstaEmAndamento={acaoEstaEmAndamento}
          getAcaoKey={getAcaoKey}
        />
      );
    }

    if (activeSection === 'facilidades') {
      return (
        <AdminFacilitiesSection
          facilidades={facilidades}
          onCadastrarFacilidade={handleCadastrarFacilidade}
          onEditarFacilidade={handleEditarFacilidade}
          onInativarFacilidade={handleInativarFacilidade}
          onReativarFacilidade={handleReativarFacilidade}
          acaoEstaEmAndamento={acaoEstaEmAndamento}
          getAcaoKey={getAcaoKey}
        />
      );
    }

    return <AdminDashboard totais={totais} onMudarSecao={mudarSecao} />;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <h1>Painel Administrativo</h1>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page">
        <AdminSidebar
          activeSection={activeSection}
          menuItems={menuItems}
          currentUser={currentUser}
          onMudarSecao={mudarSecao}
        />

        <div className="admin-content">
          <header className="admin-header">
            <div>
              <h1 className="admin-header__title">{getTituloSecao()}</h1>
              <p className="admin-header__description">{getDescricaoSecao()}</p>
            </div>

            <Button type="button" className="button-primary" onClick={carregarDadosAdmin}>
              Atualizar dados
            </Button>
          </header>

          {apiMessage && (
            <div className={`admin-message ${apiMessage.startsWith('Erro') ? 'admin-message--error' : 'admin-message--success'}`}>
              {apiMessage}
            </div>
          )}

          {renderConteudo()}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(confirmacao)}
        title={confirmacao?.title}
        message={confirmacao?.message}
        confirmText={confirmacao?.confirmText}
        variant={confirmacao?.variant}
        loading={acaoConfirmadaEstaEmAndamento()}
        onConfirm={handleConfirmarAcao}
        onCancel={fecharConfirmacao}
      />
    </>
  );
}

export default AdminPanelPage;


