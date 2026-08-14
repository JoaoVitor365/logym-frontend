// src/pages/Manager/ManagerPanelPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import AcademiaService from '../../services/AcademiaService';
import GerenteService from '../../services/GerenteService';

function ManagerPanelPage() {
  const navigate = useNavigate();

  const [managerName, setManagerName] = useState('Gerente');
  const [gerente, setGerente] = useState(null);
  const [academias, setAcademias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');

  const carregarDadosPainel = async () => {
    setLoading(true);
    setApiMessage('');

    try {
      const usuarioLogado = JSON.parse(localStorage.getItem('user'));

      if (!usuarioLogado) {
        navigate('/login', { replace: true });
        return;
      }

      if (usuarioLogado?.nome) {
        setManagerName(usuarioLogado.nome);
      }

      if (usuarioLogado?.nivelAcesso !== 'MANAGER') {
        navigate('/', { replace: true });
        return;
      }

      let gerenteEncontrado = null;

      try {
        const gerenteResponse = await GerenteService.findByUsuarioId(usuarioLogado.id);
        gerenteEncontrado = gerenteResponse.data;

        if (gerenteEncontrado?.id) {
          setGerente(gerenteEncontrado);
          localStorage.setItem('gerente', JSON.stringify(gerenteEncontrado));
        }
      } catch (error) {
        console.error('Cadastro de gerente não encontrado:', error);
        localStorage.removeItem('gerente');
        setGerente(null);
        setAcademias([]);
        setApiMessage('Cadastro de gerente não encontrado. Finalize seu cadastro antes de gerenciar academias.');
        return;
      }

      if (!gerenteEncontrado?.id) {
        setGerente(null);
        setAcademias([]);
        setApiMessage('Cadastro de gerente não encontrado. Finalize seu cadastro antes de gerenciar academias.');
        return;
      }

      const response = await AcademiaService.findByGerenteId(gerenteEncontrado.id);
      setAcademias(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Erro ao carregar painel do gerente:', error);
      setApiMessage('Erro ao carregar dados do painel.');
      setAcademias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosPainel();
  }, []);

  const academiasAtivas = useMemo(() => {
    return academias.filter((academia) => academia.statusAcademia === 'ATIVO');
  }, [academias]);

  const academiasInativas = useMemo(() => {
    return academias.filter((academia) => academia.statusAcademia === 'INATIVO');
  }, [academias]);

  const academiasSuspensas = useMemo(() => {
    return academias.filter((academia) => academia.statusAcademia === 'SUSPENSA');
  }, [academias]);

  const formatarCNPJ = (cnpj) => {
    if (!cnpj) return 'Não informado';

    const numeros = String(cnpj).replace(/\D/g, '');

    if (numeros.length !== 14) {
      return cnpj;
    }

    return numeros.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };

  const formatarCEP = (cep) => {
    if (!cep) return 'Não informado';

    const numeros = String(cep).replace(/\D/g, '');

    if (numeros.length !== 8) {
      return cep;
    }

    return numeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

  const formatarNota = (nota) => {
    if (nota === null || nota === undefined) {
      return 'Sem avaliações';
    }

    return Number(nota).toFixed(1);
  };

  const montarEndereco = (academia) => {
    const linha1 = [
      academia.endereco,
      academia.numero ? `nº ${academia.numero}` : null,
      academia.complemento
    ].filter(Boolean).join(', ');

    const linha2 = [
      academia.bairro,
      academia.cidade,
      academia.estado
    ].filter(Boolean).join(' - ');

    if (linha1 && linha2) {
      return `${linha1} | ${linha2}`;
    }

    return linha1 || linha2 || 'Endereço não informado';
  };

  const getStatusClass = (status) => {
    if (status === 'ATIVO') return 'manager-status-badge manager-status-active';
    if (status === 'SUSPENSA') return 'manager-status-badge manager-status-suspended';
    return 'manager-status-badge manager-status-inactive';
  };

  const handleEdit = (id) => {
    navigate(`/editar-academia/${id}`);
  };

  const handleInativar = async (id) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja inativar esta academia? Ela não aparecerá mais para usuários comuns.'
    );

    if (!confirmar) return;

    try {
      await AcademiaService.inativar(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'INATIVO' }
            : academia
        )
      );

      alert('Academia inativada com sucesso!');
    } catch (error) {
      console.error('Erro ao inativar academia:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao inativar academia.';

      alert(mensagemErro);
    }
  };

  const handleReativar = async (id) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja reativar esta academia? Ela voltará a aparecer para usuários comuns.'
    );

    if (!confirmar) return;

    try {
      await AcademiaService.reativar(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'ATIVO' }
            : academia
        )
      );

      alert('Academia reativada com sucesso!');
    } catch (error) {
      console.error('Erro ao reativar academia:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao reativar academia.';

      alert(mensagemErro);
    }
  };

  const renderAcademiaCard = (academia) => {
    const estaAtiva = academia.statusAcademia === 'ATIVO';
    const estaSuspensa = academia.statusAcademia === 'SUSPENSA';

    return (
      <div key={academia.id} className="manager-academy-card">
        <div className="manager-academy-content">
          <h3 className="manager-academy-title">
            {academia.nome}
          </h3>

          {estaSuspensa && (
            <div className="manager-warning-box">
              Esta academia foi suspensa pela administração. Entre em contato com o suporte para solicitar a reativação.
            </div>
          )}

          <div className="manager-academy-grid">
            <p className="manager-info-text">
              <strong>CNPJ:</strong> {formatarCNPJ(academia.cnpj)}
            </p>

            <p className="manager-info-text">
              <strong>CEP:</strong> {formatarCEP(academia.cep)}
            </p>

            <p className="manager-info-text">
              <strong>Telefone:</strong> {academia.telefone || 'Não informado'}
            </p>

            <p className="manager-info-text">
              <strong>Celular:</strong> {academia.celular || 'Não informado'}
            </p>

            <p className="manager-info-text">
              <strong>E-mail:</strong> {academia.email || 'Não informado'}
            </p>

            <p className="manager-info-text">
              <strong>Nota:</strong> {formatarNota(academia.nota)}
            </p>
          </div>

          <p className="manager-info-line">
            <strong>Endereço:</strong> {montarEndereco(academia)}
          </p>

          <p className="manager-info-line">
            <strong>Categorias:</strong> {academia.categorias || 'Não informado'}
          </p>

          <p className="manager-info-line">
            <strong>Facilidades:</strong> {academia.facilidades || 'Não informado'}
          </p>

          <p className="manager-info-line">
            <strong>Descrição:</strong> {academia.descricao}
          </p>

          <p className="manager-status-line">
            <strong>Status:</strong>

            <span className={getStatusClass(academia.statusAcademia)}>
              {academia.statusAcademia}
            </span>
          </p>
        </div>

        <div className="manager-actions">
          <Button
            onClick={() => handleEdit(academia.id)}
            className="manager-button manager-button-secondary"
          >
            Editar
          </Button>

          {estaAtiva ? (
            <Button
              onClick={() => handleInativar(academia.id)}
              className="manager-button manager-button-danger-outline"
            >
              Inativar
            </Button>
          ) : estaSuspensa ? (
            <Button
              disabled
              title="Academia suspensa pela administração. Entre em contato com o suporte."
              className="manager-button manager-button-disabled"
            >
              Reativação bloqueada
            </Button>
          ) : (
            <Button
              onClick={() => handleReativar(academia.id)}
              className="manager-button manager-button-reactivate"
            >
              Reativar
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="manager-loading-box">
        <h2>Carregando painel do gerente...</h2>
      </div>
    );
  }

  if (!gerente) {
    return (
      <div className="manager-page manager-page-small">
        <div className="manager-empty-card">
          <h1>Cadastro de gerente incompleto</h1>

          <p>
            Para acessar o painel do gerente e cadastrar academias, primeiro finalize seu cadastro de gerente.
          </p>

          {apiMessage && (
            <div className="manager-api-message manager-api-message-error">
              {apiMessage}
            </div>
          )}

          <Button
            className="button-primary manager-main-button"
            onClick={() => navigate('/completar-cadastro-gerente')}
          >
            Completar Cadastro de Gerente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-page">
      <div className="manager-header">
        <div>
          <h1>Painel de Controle</h1>

          <p>
            Bem-vindo(a), <strong>{managerName}</strong>. Você possui{' '}
            <strong>{academiasAtivas.length}</strong> academia(s) ativa(s),{' '}
            <strong>{academiasInativas.length}</strong> inativa(s) e{' '}
            <strong>{academiasSuspensas.length}</strong> suspensa(s).
          </p>
        </div>

        <Button
          className="button-primary manager-main-button"
          onClick={() => navigate('/cadastrar-academia')}
        >
          + Cadastrar Nova Academia
        </Button>
      </div>

      {apiMessage && (
        <div className="manager-api-message manager-api-message-error">
          {apiMessage}
        </div>
      )}

      {academias.length === 0 ? (
        <div className="manager-empty-state">
          <h2>Nenhuma academia cadastrada</h2>

          <p>
            Você ainda não possui academias cadastradas.
          </p>

          <Button className="button-primary" onClick={() => navigate('/cadastrar-academia')}>
            Cadastrar minha primeira academia
          </Button>
        </div>
      ) : (
        <>
          <section className="manager-section">
            <h2 className="manager-section-title">Academias Ativas</h2>

            {academiasAtivas.length === 0 ? (
              <EmptySection>Nenhuma academia ativa no momento.</EmptySection>
            ) : (
              <div className="manager-panel-list">
                {academiasAtivas.map((academia) => renderAcademiaCard(academia, 'ativa'))}
              </div>
            )}
          </section>

          <section className="manager-section">
            <h2 className="manager-section-title">Academias Inativas</h2>

            {academiasInativas.length === 0 ? (
              <EmptySection>Nenhuma academia inativa no momento.</EmptySection>
            ) : (
              <div className="manager-panel-list">
                {academiasInativas.map((academia) => renderAcademiaCard(academia, 'inativa'))}
              </div>
            )}
          </section>

          <section className="manager-section manager-section-last">
            <h2 className="manager-section-title">Academias Suspensas</h2>

            {academiasSuspensas.length === 0 ? (
              <EmptySection>Nenhuma academia suspensa no momento.</EmptySection>
            ) : (
              <div className="manager-panel-list">
                {academiasSuspensas.map((academia) => renderAcademiaCard(academia, 'suspensa'))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function EmptySection({ children }) {
  return (
    <div className="manager-empty-section">
      {children}
    </div>
  );
}

export default ManagerPanelPage;
