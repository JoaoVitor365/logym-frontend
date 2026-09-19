// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import NearbyAcademiesMap from '../../components/Academy/NearbyAcademiesMap';
import GerenteService from '../../services/GerenteService';
import AcademiaService from '../../services/AcademiaService';
import CategoriaService from '../../services/CategoriaService';
import FacilidadeService from '../../services/FacilidadeService';

function HomePage({ currentUser }) {
  const navigate = useNavigate();
  const resultadosRef = useRef(null);
  const deveRolarAteResultadosRef = useRef(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [facilidadesSelecionadas, setFacilidadesSelecionadas] = useState([]);

  const [gerente, setGerente] = useState(null);
  const [verificandoGerente, setVerificandoGerente] = useState(false);

  const [academias, setAcademias] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalResultados, setTotalResultados] = useState(0);
  const [loadingAcademias, setLoadingAcademias] = useState(true);
  const [mensagemAcademias, setMensagemAcademias] = useState('');
  const [academiasProximas, setAcademiasProximas] = useState([]);
  const [loadingAcademiasProximas, setLoadingAcademiasProximas] = useState(false);
  const [mensagemAcademiasProximas, setMensagemAcademiasProximas] = useState('');

  const [categoriasAtivas, setCategoriasAtivas] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [mensagemCategorias, setMensagemCategorias] = useState('');
  const [facilidadesAtivas, setFacilidadesAtivas] = useState([]);
  const [loadingFacilidades, setLoadingFacilidades] = useState(true);
  const [mensagemFacilidades, setMensagemFacilidades] = useState('');

  useEffect(() => {
    const verificarCadastroGerente = async () => {
      if (currentUser?.nivelAcesso !== 'MANAGER') {
        setGerente(null);
        return;
      }

      const gerenteLocalStorage = localStorage.getItem('gerente');

      if (gerenteLocalStorage) {
        setGerente(JSON.parse(gerenteLocalStorage));
      }

      setVerificandoGerente(true);

      try {
        const response = await GerenteService.findByUsuarioId(currentUser.id);

        setGerente(response.data);
        localStorage.setItem('gerente', JSON.stringify(response.data));
      } catch (error) {
        console.error('Erro ao verificar cadastro de gerente:', error);

        if (!gerenteLocalStorage) {
          setGerente(null);
        }
      } finally {
        setVerificandoGerente(false);
      }
    };

    verificarCadastroGerente();
  }, [currentUser]);

  useEffect(() => {
    let requisicaoAtiva = true;

    const carregarAcademias = async () => {
      setLoadingAcademias(true);
      setMensagemAcademias('');

      try {
        const response = await AcademiaService.findParaHome({
          page: paginaAtual,
          search: termoPesquisado,
          categorias: categoriasSelecionadas,
          facilidades: facilidadesSelecionadas
        });
        const dados = response.data;

        if (!requisicaoAtiva) {
          return;
        }

        if (!Array.isArray(dados?.content)
          || !Number.isInteger(dados?.page)
          || !Number.isInteger(dados?.totalPages)
          || typeof dados?.totalElements !== 'number') {
          console.error('Resposta inesperada ao carregar academias:', dados);
          setAcademias([]);
          setTotalPaginas(0);
          setTotalResultados(0);
          setMensagemAcademias('Erro ao carregar academias.');
          return;
        }

        setAcademias(dados.content);
        setTotalPaginas(dados.totalPages);
        setTotalResultados(dados.totalElements);

        if (deveRolarAteResultadosRef.current) {
          resultadosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          deveRolarAteResultadosRef.current = false;
        }
      } catch (error) {
        if (!requisicaoAtiva) {
          return;
        }

        console.error('Erro ao carregar academias:', error);
        setMensagemAcademias('Erro ao carregar academias.');
        setAcademias([]);
        setTotalPaginas(0);
        setTotalResultados(0);
      } finally {
        if (requisicaoAtiva) {
          setLoadingAcademias(false);
        }
      }
    };

    carregarAcademias();

    return () => {
      requisicaoAtiva = false;
    };
  }, [paginaAtual, termoPesquisado, categoriasSelecionadas, facilidadesSelecionadas]);

  useEffect(() => {
    const carregarAcademiasProximas = async () => {
      if (currentUser?.nivelAcesso !== 'USER') {
        setAcademiasProximas([]);
        setMensagemAcademiasProximas('');
        setLoadingAcademiasProximas(false);
        return;
      }

      setLoadingAcademiasProximas(true);
      setMensagemAcademiasProximas('');

      try {
        const response = await AcademiaService.getAcademiasProximas();

        if (Array.isArray(response.data)) {
          setAcademiasProximas(response.data);
        } else {
          console.error('Resposta inesperada ao carregar academias próximas:', response.data);
          setAcademiasProximas([]);
          setMensagemAcademiasProximas('Não foi possível carregar as academias próximas.');
        }
      } catch (error) {
        console.error('Erro ao carregar academias próximas:', error);
        setAcademiasProximas([]);

        if (error.response?.status === 400) {
          setMensagemAcademiasProximas('Atualize seu endereço no perfil para encontrar academias próximas.');
        } else {
          setMensagemAcademiasProximas('Não foi possível carregar as academias próximas agora.');
        }
      } finally {
        setLoadingAcademiasProximas(false);
      }
    };

    carregarAcademiasProximas();
  }, [
    currentUser?.id,
    currentUser?.nivelAcesso,
    currentUser?.latitude,
    currentUser?.longitude
  ]);

  useEffect(() => {
    const carregarCategorias = async () => {
      setLoadingCategorias(true);
      setMensagemCategorias('');

      try {
        const response = await CategoriaService.findAtivas();
        const dados = response.data;

        if (Array.isArray(dados)) {
          setCategoriasAtivas(dados);
        } else if (Array.isArray(dados?.content)) {
          setCategoriasAtivas(dados.content);
        } else {
          console.error('Resposta inesperada ao carregar categorias:', dados);
          setCategoriasAtivas([]);
          setMensagemCategorias('Não foi possível carregar as categorias.');
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategoriasAtivas([]);
        setMensagemCategorias('Não foi possível carregar as categorias.');
      } finally {
        setLoadingCategorias(false);
      }
    };

    carregarCategorias();
  }, []);

  useEffect(() => {
    const carregarFacilidades = async () => {
      setLoadingFacilidades(true);
      setMensagemFacilidades('');

      try {
        const response = await FacilidadeService.findAtivas();
        const dados = response.data;

        if (Array.isArray(dados)) {
          setFacilidadesAtivas(dados);
        } else if (Array.isArray(dados?.content)) {
          setFacilidadesAtivas(dados.content);
        } else {
          console.error('Resposta inesperada ao carregar facilidades:', dados);
          setFacilidadesAtivas([]);
          setMensagemFacilidades('Não foi possível carregar as facilidades.');
        }
      } catch (error) {
        console.error('Erro ao carregar facilidades:', error);
        setFacilidadesAtivas([]);
        setMensagemFacilidades('Não foi possível carregar as facilidades.');
      } finally {
        setLoadingFacilidades(false);
      }
    };

    carregarFacilidades();
  }, []);

  const normalizarId = (id) => Number(id);

  const paginasVisiveis = useMemo(() => {
    if (totalPaginas <= 7) {
      return Array.from({ length: totalPaginas }, (_, index) => index);
    }

    const paginas = new Set([0, totalPaginas - 1, paginaAtual - 1, paginaAtual, paginaAtual + 1]);
    const ordenadas = [...paginas]
      .filter((pagina) => pagina >= 0 && pagina < totalPaginas)
      .sort((a, b) => a - b);

    return ordenadas.reduce((itens, pagina, index) => {
      if (index > 0 && pagina - ordenadas[index - 1] > 1) {
        itens.push(`ellipsis-${pagina}`);
      }

      itens.push(pagina);
      return itens;
    }, []);
  }, [paginaAtual, totalPaginas]);

  const handleSearch = (e) => {
    e.preventDefault();
    setTermoPesquisado(searchTerm);
    setPaginaAtual(0);
  };

  const alternarCategoria = (categoriaId) => {
    const idNormalizado = normalizarId(categoriaId);

    setCategoriasSelecionadas((categoriasAtuais) => {
      if (categoriasAtuais.includes(idNormalizado)) {
        return categoriasAtuais.filter((item) => item !== idNormalizado);
      }

      return [...categoriasAtuais, idNormalizado];
    });
    setPaginaAtual(0);
  };

  const alternarFacilidade = (facilidadeId) => {
    const idNormalizado = normalizarId(facilidadeId);

    setFacilidadesSelecionadas((facilidadesAtuais) => {
      if (facilidadesAtuais.includes(idNormalizado)) {
        return facilidadesAtuais.filter((item) => item !== idNormalizado);
      }

      return [...facilidadesAtuais, idNormalizado];
    });
    setPaginaAtual(0);
  };

  const limparBusca = () => {
    setSearchTerm('');
    setTermoPesquisado('');
    setPaginaAtual(0);
  };

  const limparTudo = () => {
    setSearchTerm('');
    setTermoPesquisado('');
    setCategoriasSelecionadas([]);
    setFacilidadesSelecionadas([]);
    setPaginaAtual(0);
  };

  const trocarPagina = (novaPagina) => {
    if (novaPagina < 0 || novaPagina >= totalPaginas || novaPagina === paginaAtual) {
      return;
    }

    deveRolarAteResultadosRef.current = true;
    setPaginaAtual(novaPagina);
  };

  const categoriasSelecionadasNomes = categoriasSelecionadas
    .map((categoriaId) => categoriasAtivas.find(
      (categoria) => normalizarId(categoria.id) === normalizarId(categoriaId)
    )?.nome)
    .filter(Boolean);

  const facilidadesSelecionadasNomes = facilidadesSelecionadas
    .map((facilidadeId) => facilidadesAtivas.find(
      (facilidade) => normalizarId(facilidade.id) === normalizarId(facilidadeId)
    )?.nome)
    .filter(Boolean);

  return (
    <div className="home-page">
      <header className="home-hero">
        <span className="home-eyebrow">Encontre sua academia</span>
        <h1>Encontre a academia ideal para você</h1>
        <p>Busque, compare e descubra academias próximas ao seu endereço.</p>
      </header>

      {currentUser?.nivelAcesso === 'MANAGER' && (
        <div className="home-manager-card">
          <h2>Área do gerente</h2>

          {verificandoGerente && !gerente ? (
            <p>Verificando cadastro de gerente...</p>
          ) : gerente ? (
            <>
              <p>
                Seu cadastro de gerente já foi concluído. Agora você pode cadastrar e gerenciar suas academias.
              </p>

              <div className="home-manager-actions">
                <Button
                  type="button"
                  className="button-primary"
                  onClick={() => navigate('/cadastrar-academia')}
                >
                  Cadastrar Academia
                </Button>

                <Button
                  type="button"
                  className="button-primary"
                  onClick={() => navigate('/painel-gerente')}
                >
                  Gerenciar Academias
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                Para cadastrar uma academia, primeiro finalize seu cadastro de gerente.
              </p>

              <Button
                type="button"
                className="button-primary"
                onClick={() => navigate('/completar-cadastro-gerente')}
              >
                Finalizar Cadastro
              </Button>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSearch} className="search-section">
        <Input
          type="text"
          id="search"
          name="search"
          placeholder="Ex: categoria, facilidade, bairro, Paulista"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          endAdornment={(
            <svg className="home-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          )}
        />

        <Button type="submit" className="button-primary">
          Buscar
        </Button>

        {termoPesquisado && (
          <Button
            type="button"
            className="button-cancel"
            onClick={limparBusca}
          >
            Limpar busca
          </Button>
        )}
      </form>

      <div className="home-filters-section">
        <div className="home-section-heading">
          <div>
            <h2>Filtros rápidos</h2>
            <p>Refine os resultados conforme suas preferências.</p>
          </div>
        </div>

        <div className="home-filters-list">
          {categoriasAtivas.map((categoria) => {
            const categoriaId = normalizarId(categoria.id);

            return (
              <button
                key={categoria.id}
                type="button"
                className={`home-filter-button ${categoriasSelecionadas.includes(categoriaId) ? 'active' : ''}`}
                onClick={() => alternarCategoria(categoria.id)}
              >
                {categoriasSelecionadas.includes(categoriaId) && <span aria-hidden="true">✓</span>}
                {categoria.nome}
              </button>
            );
          })}

          {facilidadesAtivas.map((facilidade) => {
            const facilidadeId = normalizarId(facilidade.id);

            return (
              <button
                key={facilidade.id}
                type="button"
                className={`home-filter-button ${facilidadesSelecionadas.includes(facilidadeId) ? 'active' : ''}`}
                onClick={() => alternarFacilidade(facilidade.id)}
              >
                {facilidadesSelecionadas.includes(facilidadeId) && <span aria-hidden="true">✓</span>}
                {facilidade.nome}
              </button>
            );
          })}
        </div>

        {loadingCategorias && (
          <p className="home-filter-message">Carregando categorias...</p>
        )}

        {mensagemCategorias && (
          <p className="home-filter-message home-filter-message-error">
            {mensagemCategorias}
          </p>
        )}

        {loadingFacilidades && (
          <p className="home-filter-message">Carregando facilidades...</p>
        )}

        {mensagemFacilidades && (
          <p className="home-filter-message home-filter-message-error">
            {mensagemFacilidades}
          </p>
        )}

        {(termoPesquisado || categoriasSelecionadas.length > 0 || facilidadesSelecionadas.length > 0) && (
          <button
            type="button"
            className="home-clear-filters-button"
            onClick={limparTudo}
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {(termoPesquisado || categoriasSelecionadas.length > 0 || facilidadesSelecionadas.length > 0) && !loadingAcademias && (
        <div className="home-search-summary">
          {termoPesquisado && (
            <span>
              Busca: <strong>{termoPesquisado}</strong>
            </span>
          )}

          {categoriasSelecionadasNomes.length > 0 && (
            <span>
              Categorias: <strong>{categoriasSelecionadasNomes.join(' + ')}</strong>
            </span>
          )}

          {facilidadesSelecionadasNomes.length > 0 && (
            <span>
              Facilidades: <strong>{facilidadesSelecionadasNomes.join(' + ')}</strong>
            </span>
          )}

          <span>
            Resultado: <strong>{totalResultados}</strong> academia(s)
          </span>
        </div>
      )}

      {currentUser?.nivelAcesso === 'USER' && (
        <div className="home-nearby-map-section">
          <div className="home-map-heading">
            <div>
              <span className="home-eyebrow">Por perto</span>
              <h2>Academias próximas de você</h2>
              <p>Veja academias localizadas em um raio de até 5 km.</p>
            </div>
          </div>
          {loadingAcademiasProximas ? (
            <p className="home-location-info">Carregando academias próximas...</p>
          ) : mensagemAcademiasProximas ? (
            <p className="home-location-info">{mensagemAcademiasProximas}</p>
          ) : academiasProximas.length === 0 ? (
            <p className="home-location-info">Nenhuma academia encontrada em até 5 km da sua localização.</p>
          ) : (
            <NearbyAcademiesMap
              userLatitude={currentUser.latitude}
              userLongitude={currentUser.longitude}
              academiasProximas={academiasProximas}
            />
          )}
        </div>
      )}

      <section ref={resultadosRef} className="home-results-section" aria-busy={loadingAcademias}>
        {!loadingAcademias && !mensagemAcademias && (
          <div className="home-results-heading">
            <div>
              <span className="home-eyebrow">Explore opções</span>
              <h2>Academias encontradas</h2>
            </div>
            <span className="home-results-count">
              {totalResultados} {totalResultados === 1 ? 'academia disponível' : 'academias disponíveis'}
            </span>
          </div>
        )}
        {loadingAcademias ? (
          <div className="home-feedback-card home-loading-card">
          <h2>Carregando academias...</h2>
          </div>
        ) : mensagemAcademias ? (
          <div className="home-feedback-card home-error-card">
          {mensagemAcademias}
          </div>
        ) : totalResultados === 0 ? (
          <div className="home-feedback-card home-empty-card">
          <span className="home-empty-icon" aria-hidden="true">⌕</span>
          <h2>Não encontramos academias com esses filtros.</h2>
          <p>Experimente ajustar sua busca ou limpar os filtros.</p>

          {(termoPesquisado || categoriasSelecionadas.length > 0 || facilidadesSelecionadas.length > 0) && (
            <Button
              type="button"
              className="button-primary"
              onClick={limparTudo}
            >
              Ver todas as academias
            </Button>
          )}
          </div>
        ) : (
          <>
            <div className="academies-grid">
              {academias.map((academia) => (
                <Card
                  key={academia.id}
                  academy={academia}
                  categoriasAtivas={categoriasAtivas}
                  distanciaKm={academia.distanciaKm}
                  variant="home-card"
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <nav className="home-pagination" aria-label="Paginação de academias">
                <button
                  type="button"
                  className="home-pagination-button"
                  onClick={() => trocarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 0}
                >
                  Anterior
                </button>

                {paginasVisiveis.map((item) => (
                  typeof item === 'string' ? (
                    <span key={item} className="home-pagination-ellipsis" aria-hidden="true">…</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`home-pagination-button ${item === paginaAtual ? 'active' : ''}`}
                      onClick={() => trocarPagina(item)}
                      aria-current={item === paginaAtual ? 'page' : undefined}
                    >
                      {item + 1}
                    </button>
                  )
                ))}

                <button
                  type="button"
                  className="home-pagination-button"
                  onClick={() => trocarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas - 1}
                >
                  Próxima
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;




