// src/pages/Admin/AdminPanelPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import UsuarioService from '../../services/UsuarioService';
import AcademiaService from '../../services/AcademiaService';
import GerenteService from '../../services/GerenteService';
import AvaliacaoService from '../../services/AvaliacaoService';

import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminUsersSection from './AdminUsersSection';
import AdminManagersSection from './AdminManagersSection';
import AdminAcademiesSection from './AdminAcademiesSection';
import AdminReviewsSection from './AdminReviewsSection';

function AdminPanelPage({ currentUser }) {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('dashboard');

  const [usuarios, setUsuarios] = useState([]);
  const [academias, setAcademias] = useState([]);
  const [gerentes, setGerentes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

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

  const carregarDadosAdmin = async () => {
    setLoading(true);
    setApiMessage('');

    try {
      const [usuariosResponse, academiasResponse, gerentesResponse, avaliacoesResponse] = await Promise.all([
        UsuarioService.findAll(),
        AcademiaService.findAllAdmin(),
        GerenteService.findAll(),
        AvaliacaoService.findAllAdmin()
      ]);

      setUsuarios(Array.isArray(usuariosResponse.data) ? usuariosResponse.data : []);
      setAcademias(Array.isArray(academiasResponse.data) ? academiasResponse.data : []);
      setGerentes(Array.isArray(gerentesResponse.data) ? gerentesResponse.data : []);
      setAvaliacoes(Array.isArray(avaliacoesResponse.data) ? avaliacoesResponse.data : []);
    } catch (error) {
      console.error('Erro ao carregar painel admin:', error);
      setApiMessage('Erro ao carregar dados do painel administrativo.');
      setUsuarios([]);
      setAcademias([]);
      setGerentes([]);
      setAvaliacoes([]);
    } finally {
      setLoading(false);
    }
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
      avaliacoesSuspensas: avaliacoesSuspensas.length
    };
  }, [usuarios, academias, gerentes, avaliacoes]);

  const handleAtivarUsuario = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja reativar este usuário?');

    if (!confirmar) return;

    try {
      await UsuarioService.ativar(id);

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === id
            ? { ...usuario, statusUsuario: 'ATIVO' }
            : usuario
        )
      );

      setApiMessage('Usuário reativado com sucesso.');
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      setApiMessage('Erro ao reativar usuário.');
    }
  };

  const handleSuspenderUsuario = async (id) => {
    const usuarioLogado = currentUser || JSON.parse(localStorage.getItem('user'));

    if (usuarioLogado?.id === id) {
      setApiMessage('Erro: você não pode suspender a própria conta ADMIN por aqui.');
      return;
    }

    const confirmar = window.confirm('Tem certeza que deseja suspender este usuário?');

    if (!confirmar) return;

    try {
      await UsuarioService.suspender(id);

      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === id
            ? { ...usuario, statusUsuario: 'SUSPENSO' }
            : usuario
        )
      );

      setApiMessage('Usuário suspenso com sucesso.');
    } catch (error) {
      console.error('Erro ao suspender usuário:', error);
      setApiMessage('Erro ao suspender usuário.');
    }
  };

  const handleReativarAcademia = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja reativar esta academia?');

    if (!confirmar) return;

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
    }
  };

  const handleSuspenderAcademia = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja suspender esta academia? O gerente não poderá reativá-la pelo painel dele.');

    if (!confirmar) return;

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
    }
  };

  const handleSuspenderAvaliacao = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja suspender esta avaliação? Ela não aparecerá para outros usuários e não contará na média da academia.');

    if (!confirmar) return;

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
    }
  };

  const handleReativarAvaliacao = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja reativar esta avaliação? Ela voltará a aparecer e contará na média da academia.');

    if (!confirmar) return;

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
    }
  };

  const recarregarAcademiasAdmin = async () => {
    const response = await AcademiaService.findAllAdmin();
    setAcademias(Array.isArray(response.data) ? response.data : []);
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
    { id: 'avaliacoes', label: 'Avaliações', description: `${totais.avaliacoes} registro(s)` }
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
        />
      );
    }

    if (activeSection === 'avaliacoes') {
      return (
        <AdminReviewsSection
          avaliacoes={avaliacoes}
          onSuspenderAvaliacao={handleSuspenderAvaliacao}
          onReativarAvaliacao={handleReativarAvaliacao}
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
  );
}

export default AdminPanelPage;
