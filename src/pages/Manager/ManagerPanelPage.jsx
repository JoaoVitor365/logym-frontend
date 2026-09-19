// src/pages/Manager/ManagerPanelPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button/Button';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import Toast from '../../components/Toast/Toast';
import AcademiaService from '../../services/AcademiaService';
import GerenteService from '../../services/GerenteService';
import ManagerDashboard from './ManagerDashboard';
import ManagerSidebar from './ManagerSidebar';

function ManagerPanelPage() {
  const navigate = useNavigate();

  const [managerName, setManagerName] = useState('Gerente');
  const [gerente, setGerente] = useState(null);
  const [academias, setAcademias] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [academiasCarregadas, setAcademiasCarregadas] = useState(false);
  const [termoBuscaAcademias, setTermoBuscaAcademias] = useState('');
  const [statusAcademiasSelecionado, setStatusAcademiasSelecionado] = useState('TODOS');
  const [academiasPorPagina, setAcademiasPorPagina] = useState(10);
  const [paginaAcademiasAtual, setPaginaAcademiasAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    variant: 'success'
  });
  const [acaoPendente, setAcaoPendente] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('manager-panel-active');

    return () => {
      document.body.classList.remove('manager-panel-active');
    };
  }, []);

  const carregarDadosPainel = useCallback(async () => {
    setLoading(true);
    setApiMessage('');
    setAcademiasCarregadas(false);

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
      setAcademiasCarregadas(true);
    } catch (error) {
      console.error('Erro ao carregar painel do gerente:', error);
      setApiMessage('Erro ao carregar dados do painel.');
      setAcademias([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    carregarDadosPainel();
  }, [carregarDadosPainel]);

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

  const categoriaVinculadaEstaAtiva = (vinculo) => {
    if (vinculo?.statusCategoriaAcademia && vinculo.statusCategoriaAcademia !== 'ATIVO') {
      return false;
    }

    const categoria = vinculo?.categoria || vinculo;

    if (categoria?.statusCategoria && categoria.statusCategoria !== 'ATIVO') {
      return false;
    }

    return true;
  };

  const getNomeCategoriaVinculada = (vinculo) => {
    const categoria = vinculo?.categoria || vinculo;

    return categoria?.nome || '';
  };

  const formatarCategoriasAcademia = (academia) => {
    if (Array.isArray(academia?.categoriasVinculadas) && academia.categoriasVinculadas.length > 0) {
      const categorias = academia.categoriasVinculadas
        .filter(categoriaVinculadaEstaAtiva)
        .map(getNomeCategoriaVinculada)
        .map((nome) => String(nome).trim())
        .filter(Boolean);

      return categorias.length > 0 ? categorias.join(', ') : 'Não informado';
    }

    return academia.categorias || 'Não informado';
  };

  const facilidadeVinculadaEstaAtiva = (vinculo) => {
    if (vinculo?.statusFacilidadeAcademia && vinculo.statusFacilidadeAcademia !== 'ATIVO') {
      return false;
    }

    const facilidade = vinculo?.facilidade || vinculo;

    if (facilidade?.statusFacilidade && facilidade.statusFacilidade !== 'ATIVO') {
      return false;
    }

    return true;
  };

  const getNomeFacilidadeVinculada = (vinculo) => {
    const facilidade = vinculo?.facilidade || vinculo;

    return facilidade?.nome || '';
  };

  const formatarFacilidadesAcademia = (academia) => {
    if (Array.isArray(academia?.facilidadesVinculadas) && academia.facilidadesVinculadas.length > 0) {
      const facilidades = academia.facilidadesVinculadas
        .filter(facilidadeVinculadaEstaAtiva)
        .map(getNomeFacilidadeVinculada)
        .map((nome) => String(nome).trim())
        .filter(Boolean);

      return facilidades.length > 0 ? facilidades.join(', ') : 'Não informado';
    }

    return academia.facilidades || 'Não informado';
  };

  const getStatusClass = (status) => {
    if (status === 'ATIVO') return 'manager-status-badge manager-status-active';
    if (status === 'SUSPENSA') return 'manager-status-badge manager-status-suspended';
    return 'manager-status-badge manager-status-inactive';
  };

  const academiasFiltradas = useMemo(() => {
    const normalizarTexto = (valor) => String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    const termoNormalizado = normalizarTexto(termoBuscaAcademias);

    return academias.filter((academia) => {
      const correspondeBusca = !termoNormalizado || [
        academia.nome,
        academia.cnpj,
        academia.cidade,
        academia.estado,
        academia.endereco,
        academia.bairro
      ].some((valor) => normalizarTexto(valor).includes(termoNormalizado));
      const correspondeStatus = statusAcademiasSelecionado === 'TODOS'
        || academia.statusAcademia === statusAcademiasSelecionado;

      return correspondeBusca && correspondeStatus;
    });
  }, [academias, statusAcademiasSelecionado, termoBuscaAcademias]);

  const totalPaginasAcademias = Math.max(1, Math.ceil(academiasFiltradas.length / academiasPorPagina));
  const paginaAcademiasEfetiva = Math.min(paginaAcademiasAtual, totalPaginasAcademias);
  const indiceInicialAcademias = (paginaAcademiasEfetiva - 1) * academiasPorPagina;
  const academiasDaPagina = academiasFiltradas.slice(
    indiceInicialAcademias,
    indiceInicialAcademias + academiasPorPagina
  );
  const primeiroRegistroAcademias = academiasFiltradas.length === 0 ? 0 : indiceInicialAcademias + 1;
  const ultimoRegistroAcademias = Math.min(
    indiceInicialAcademias + academiasDaPagina.length,
    academiasFiltradas.length
  );

  const paginasVisiveis = useMemo(() => {
    const paginas = new Set([1, totalPaginasAcademias, paginaAcademiasEfetiva]);

    [paginaAcademiasEfetiva - 1, paginaAcademiasEfetiva + 1].forEach((pagina) => {
      if (pagina > 1 && pagina < totalPaginasAcademias) {
        paginas.add(pagina);
      }
    });

    return [...paginas]
      .sort((paginaA, paginaB) => paginaA - paginaB)
      .reduce((itens, pagina, indice, todasPaginas) => {
        if (indice > 0 && pagina - todasPaginas[indice - 1] > 1) {
          itens.push(`ellipsis-${pagina}`);
        }

        itens.push(pagina);
        return itens;
      }, []);
  }, [paginaAcademiasEfetiva, totalPaginasAcademias]);

  useEffect(() => {
    setPaginaAcademiasAtual(1);
  }, [academiasPorPagina, statusAcademiasSelecionado, termoBuscaAcademias]);

  useEffect(() => {
    if (paginaAcademiasAtual > totalPaginasAcademias) {
      setPaginaAcademiasAtual(totalPaginasAcademias);
    }
  }, [paginaAcademiasAtual, totalPaginasAcademias]);

  const handleEdit = (id) => {
    navigate(`/editar-academia/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/academia/${id}`);
  };

  const executarInativacao = async (id) => {
    try {
      await AcademiaService.inativar(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'INATIVO' }
            : academia
        )
      );

      setToast({
        open: true,
        message: 'Academia inativada com sucesso!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao inativar academia:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao inativar academia.';

      setToast({
        open: true,
        message: mensagemErro,
        variant: 'error'
      });
    }
  };

  const executarReativacao = async (id) => {
    try {
      await AcademiaService.reativar(id);

      setAcademias((prev) =>
        prev.map((academia) =>
          academia.id === id
            ? { ...academia, statusAcademia: 'ATIVO' }
            : academia
        )
      );

      setToast({
        open: true,
        message: 'Academia reativada com sucesso!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erro ao reativar academia:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao reativar academia.';

      setToast({
        open: true,
        message: mensagemErro,
        variant: 'error'
      });
    }
  };

  const handleInativar = (academia) => {
    setAcaoPendente({
      tipo: 'inativar',
      academia
    });
  };

  const handleReativar = (academia) => {
    setAcaoPendente({
      tipo: 'reativar',
      academia
    });
  };

  const cancelarAcaoPendente = () => {
    if (!confirmLoading) {
      setAcaoPendente(null);
    }
  };

  const confirmarAcaoPendente = async () => {
    if (!acaoPendente?.academia?.id) return;

    setConfirmLoading(true);

    try {
      if (acaoPendente.tipo === 'inativar') {
        await executarInativacao(acaoPendente.academia.id);
      } else {
        await executarReativacao(acaoPendente.academia.id);
      }

      setAcaoPendente(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderAcademiaCard = (academia) => {
    const estaAtiva = academia.statusAcademia === 'ATIVO';
    const estaSuspensa = academia.statusAcademia === 'SUSPENSA';
    const cidadeEstado = [academia.cidade, academia.estado].filter(Boolean).join(' - ') || 'Não informado';
    const contato = [
      academia.telefone && `Telefone: ${academia.telefone}`,
      academia.celular && `Celular: ${academia.celular}`,
      academia.email && `E-mail: ${academia.email}`
    ].filter(Boolean).join('\n') || 'Não informado';
    const endereco = `${montarEndereco(academia)}\nCEP: ${formatarCEP(academia.cep)}`;

    return (
      <article key={academia.id} className="manager-academy-list-item">
        <div className="manager-academy-list-item__content">
          <div className="manager-academy-list-item__heading">
            <div>
              <h3 className="manager-academy-title">
                {academia.nome}
              </h3>
              <span className="manager-academy-id">ID: {academia.id}</span>
            </div>

            <span className={getStatusClass(academia.statusAcademia)}>
              {academia.statusAcademia}
            </span>
          </div>

          {estaSuspensa && (
            <div className="manager-warning-box">
              Esta academia foi suspensa pela administração. Entre em contato com o suporte para solicitar a reativação.
            </div>
          )}

          <div className="manager-academy-summary-grid">
            <InfoAcademia label="Nota" value={formatarNota(academia.nota)} />
            <InfoAcademia label="Cidade" value={cidadeEstado} />
            <InfoAcademia label="CNPJ" value={formatarCNPJ(academia.cnpj)} />
          </div>

          <div className="manager-academy-location-grid">
            <InfoAcademia label="Endereço" value={endereco} />
            <InfoAcademia label="Contato" value={contato} />
          </div>

          <div className="manager-academy-structure-grid">
            <InfoAcademia label="Categorias" value={formatarCategoriasAcademia(academia)} />
            <InfoAcademia label="Facilidades" value={formatarFacilidadesAcademia(academia)} />
          </div>

          {academia.descricao && (
            <InfoAcademia label="Descrição" value={academia.descricao} className="manager-academy-description" />
          )}
        </div>

        <div className="manager-actions manager-academy-list-item__actions">
          <Button
            onClick={() => handleDetails(academia.id)}
            className="manager-button manager-button-details"
          >
            Ver detalhes
          </Button>

          <Button
            onClick={() => handleEdit(academia.id)}
            className="manager-button manager-button-secondary"
          >
            Editar
          </Button>

          {estaAtiva ? (
            <Button
              onClick={() => handleInativar(academia)}
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
              onClick={() => handleReativar(academia)}
              className="manager-button manager-button-reactivate"
            >
              Reativar
            </Button>
          )}
        </div>
      </article>
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
    <div className="manager-panel-layout">
      <ManagerSidebar
        activeSection={activeSection}
        managerName={managerName}
        onSectionChange={setActiveSection}
      />

      <main className="manager-panel-content">
        {apiMessage && (
          <div className="manager-api-message manager-api-message-error">
            {apiMessage}
          </div>
        )}

        {activeSection === 'dashboard' ? (
          <ManagerDashboard
            academias={academias}
            academiasCarregadas={academiasCarregadas}
            onCadastrarAcademia={() => navigate('/cadastrar-academia')}
            onVerAcademias={() => setActiveSection('academias')}
            onGerenciarAcademia={handleEdit}
          />
        ) : (
          <section className="manager-academies-section manager-section-shell">
      <div className="manager-header">
        <div>
          <span className="manager-eyebrow">Gestão de academias</span>
          <h1>Minhas Academias</h1>

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

      <section className="manager-academies-box">
        <div className="manager-academies-box__header">
          <div className="manager-academies-box__heading">
            <div>
              <span className="manager-eyebrow">Gestão</span>
              <h2 className="manager-academies-box__title">Academias cadastradas</h2>
            </div>
            <span className="manager-records-count">{academias.length} {academias.length === 1 ? 'registro' : 'registros'}</span>
          </div>

          <div className="manager-academies-controls">
            <label className="manager-academies-control manager-academies-control--search" htmlFor="buscaAcademiasGerente">
              <span>Buscar</span>
              <input
                id="buscaAcademiasGerente"
                type="search"
                value={termoBuscaAcademias}
                onChange={(event) => {
                  setTermoBuscaAcademias(event.target.value);
                  setPaginaAcademiasAtual(1);
                }}
                placeholder="Nome, CNPJ, cidade ou endereço"
              />
            </label>

            <label className="manager-academies-control" htmlFor="statusAcademiasGerente">
              <span>Status</span>
              <select
                id="statusAcademiasGerente"
                value={statusAcademiasSelecionado}
                onChange={(event) => {
                  setStatusAcademiasSelecionado(event.target.value);
                  setPaginaAcademiasAtual(1);
                }}
              >
                <option value="TODOS">Todos</option>
                <option value="ATIVO">Ativas</option>
                <option value="INATIVO">Inativas</option>
                <option value="SUSPENSA">Suspensas</option>
              </select>
            </label>

            <label className="manager-academies-control" htmlFor="academiasPorPaginaGerente">
              <span>Por página</span>
              <select
                id="academiasPorPaginaGerente"
                value={academiasPorPagina}
                onChange={(event) => {
                  setAcademiasPorPagina(Number(event.target.value));
                  setPaginaAcademiasAtual(1);
                }}
              >
                {[5, 10, 15, 20].map((quantidade) => (
                  <option key={quantidade} value={quantidade}>{quantidade}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="manager-academies-box__body">
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
      ) : academiasFiltradas.length === 0 ? (
        <div className="manager-academies-empty">
          Nenhuma academia encontrada para os filtros selecionados.
        </div>
      ) : (
        <div className="manager-academies-list">
          {academiasDaPagina.map(renderAcademiaCard)}
        </div>
      )}

        </div>

        <footer className="manager-academies-box__footer">
          <span className="manager-academies-results">
            Mostrando {primeiroRegistroAcademias}–{ultimoRegistroAcademias} de {academiasFiltradas.length} academias
          </span>

          <nav className="manager-academies-pagination" aria-label="Paginação das academias">
            <button
              type="button"
              onClick={() => setPaginaAcademiasAtual(paginaAcademiasEfetiva - 1)}
              disabled={paginaAcademiasEfetiva === 1 || academiasFiltradas.length === 0}
            >
              Anterior
            </button>

            {paginasVisiveis.map((item) => (
              typeof item === 'number' ? (
                <button
                  key={item}
                  type="button"
                  className={item === paginaAcademiasEfetiva ? 'manager-academies-page-button--active' : ''}
                  onClick={() => setPaginaAcademiasAtual(item)}
                  aria-current={item === paginaAcademiasEfetiva ? 'page' : undefined}
                >
                  {item}
                </button>
              ) : (
                <span key={item} className="manager-academies-pagination-ellipsis">…</span>
              )
            ))}

            <button
              type="button"
              onClick={() => setPaginaAcademiasAtual(paginaAcademiasEfetiva + 1)}
              disabled={paginaAcademiasEfetiva === totalPaginasAcademias || academiasFiltradas.length === 0}
            >
              Próxima
            </button>
          </nav>
        </footer>
      </section>
          </section>
        )}

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <ConfirmModal
        open={Boolean(acaoPendente)}
        title={acaoPendente?.tipo === 'inativar' ? 'Inativar academia' : 'Reativar academia'}
        message={
          acaoPendente?.tipo === 'inativar'
            ? 'Tem certeza que deseja inativar esta academia? Ela não aparecerá mais para usuários comuns.'
            : 'Tem certeza que deseja reativar esta academia?'
        }
        confirmText={acaoPendente?.tipo === 'inativar' ? 'Inativar' : 'Reativar'}
        cancelText="Cancelar"
        variant={acaoPendente?.tipo === 'inativar' ? 'danger' : 'default'}
        loading={confirmLoading}
        onConfirm={confirmarAcaoPendente}
        onCancel={cancelarAcaoPendente}
      />
      </main>
    </div>
  );
}

function InfoAcademia({ label, value, className = '' }) {
  const tags = (label === 'Categorias' || label === 'Facilidades') && value !== 'Não informado'
    ? String(value).split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <div className={`manager-academy-info ${className}`}>
      <strong className="manager-academy-info__label">{label}</strong>
      {tags.length > 0 ? (
        <span className="manager-academy-tags">
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </span>
      ) : (
        <span className="manager-academy-info__value">{value || 'Não informado'}</span>
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
