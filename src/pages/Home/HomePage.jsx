// src/pages/HomePage.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import GerenteService from '../../services/GerenteService';
import AcademiaService from '../../services/AcademiaService';
import CategoriaService from '../../services/CategoriaService';
import FacilidadeService from '../../services/FacilidadeService';

function HomePage({ currentUser }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [facilidadesSelecionadas, setFacilidadesSelecionadas] = useState([]);

  const [gerente, setGerente] = useState(null);
  const [verificandoGerente, setVerificandoGerente] = useState(false);

  const [academias, setAcademias] = useState([]);
  const [loadingAcademias, setLoadingAcademias] = useState(true);
  const [mensagemAcademias, setMensagemAcademias] = useState('');

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
    const carregarAcademias = async () => {
      setLoadingAcademias(true);
      setMensagemAcademias('');

      try {
        const response = await AcademiaService.findAll();

        const dados = response.data;

        if (Array.isArray(dados)) {
          setAcademias(dados);
        } else if (Array.isArray(dados?.content)) {
          setAcademias(dados.content);
        } else {
          console.error('Resposta inesperada ao carregar academias:', dados);
          setAcademias([]);
          setMensagemAcademias('Erro ao carregar academias.');
        }
      } catch (error) {
        console.error('Erro ao carregar academias:', error);
        setMensagemAcademias('Erro ao carregar academias.');
        setAcademias([]);
      } finally {
        setLoadingAcademias(false);
      }
    };

    carregarAcademias();
  }, []);

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

  const normalizarTexto = useCallback((texto) => {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }, []);

  const normalizarId = useCallback((idCategoria) => Number(idCategoria), []);

  const getCategoriaIdsAcademia = useCallback((academia) => {
    if (!Array.isArray(academia?.categoriaIds)) {
      return [];
    }

    return academia.categoriaIds.map(normalizarId).filter(Number.isFinite);
  }, [normalizarId]);

  const getNomesCategoriasAcademia = useCallback((academia) => {
    const categoriaIdsAcademia = getCategoriaIdsAcademia(academia);

    if (categoriaIdsAcademia.length === 0) {
      return '';
    }

    return categoriasAtivas
      .filter((categoria) => categoriaIdsAcademia.includes(normalizarId(categoria.id)))
      .map((categoria) => categoria.nome)
      .join(' ');
  }, [categoriasAtivas, getCategoriaIdsAcademia, normalizarId]);

  const getFacilidadeIdsAcademia = useCallback((academia) => {
    if (!Array.isArray(academia?.facilidadeIds)) {
      return [];
    }

    return academia.facilidadeIds.map(normalizarId).filter(Number.isFinite);
  }, [normalizarId]);

  const getNomesFacilidadesAcademia = useCallback((academia) => {
    const facilidadeIdsAcademia = getFacilidadeIdsAcademia(academia);

    if (facilidadeIdsAcademia.length === 0) {
      return '';
    }

    return facilidadesAtivas
      .filter((facilidade) => facilidadeIdsAcademia.includes(normalizarId(facilidade.id)))
      .map((facilidade) => facilidade.nome)
      .join(' ');
  }, [facilidadesAtivas, getFacilidadeIdsAcademia, normalizarId]);

  const academiaContemTermo = useCallback((academia, termo) => {
    const facilidadeIdsAcademia = getFacilidadeIdsAcademia(academia);
    const facilidadesLegadas = facilidadeIdsAcademia.length === 0 ? academia.facilidades : '';

    const textoPesquisavel = normalizarTexto(`
      ${academia.nome}
      ${academia.descricao}
      ${academia.cep}
      ${academia.endereco}
      ${academia.numero}
      ${academia.complemento}
      ${academia.bairro}
      ${academia.cidade}
      ${academia.estado}
      ${academia.telefone}
      ${academia.celular}
      ${academia.email}
      ${academia.categorias}
      ${getNomesCategoriasAcademia(academia)}
      ${facilidadesLegadas}
      ${getNomesFacilidadesAcademia(academia)}
    `);

    return textoPesquisavel.includes(termo);
  }, [getFacilidadeIdsAcademia, getNomesCategoriasAcademia, getNomesFacilidadesAcademia, normalizarTexto]);

  const academiaPossuiCategoria = useCallback((academia, categoria) => {
    const categoriaId = normalizarId(categoria.id);
    const categoriaIdsAcademia = getCategoriaIdsAcademia(academia);

    if (categoriaIdsAcademia.length > 0 && Number.isFinite(categoriaId)) {
      return categoriaIdsAcademia.includes(categoriaId);
    }

    return academiaContemTermo(academia, normalizarTexto(categoria.nome));
  }, [academiaContemTermo, getCategoriaIdsAcademia, normalizarId, normalizarTexto]);

  const academiaPossuiFacilidade = useCallback((academia, facilidade) => {
    const facilidadeId = normalizarId(facilidade.id);
    const facilidadeIdsAcademia = getFacilidadeIdsAcademia(academia);

    if (facilidadeIdsAcademia.length > 0 && Number.isFinite(facilidadeId)) {
      return facilidadeIdsAcademia.includes(facilidadeId);
    }

    return academiaContemTermo(academia, normalizarTexto(facilidade.nome));
  }, [academiaContemTermo, getFacilidadeIdsAcademia, normalizarId, normalizarTexto]);

  const academiasFiltradas = useMemo(() => {
    const termoBusca = normalizarTexto(termoPesquisado.trim());

    const listaAcademias = Array.isArray(academias) ? academias : [];

    const filtradas = listaAcademias.filter((academia) => {
      const passaNaBusca = termoBusca
        ? academiaContemTermo(academia, termoBusca)
        : true;

      const passaNasCategorias = categoriasSelecionadas.length > 0
        ? categoriasSelecionadas.every((categoriaId) => {
          const categoria = categoriasAtivas.find(
            (item) => normalizarId(item.id) === normalizarId(categoriaId)
          );

          return categoria ? academiaPossuiCategoria(academia, categoria) : false;
        })
        : true;

      const passaNasFacilidades = facilidadesSelecionadas.length > 0
        ? facilidadesSelecionadas.every((facilidadeId) => {
          const facilidade = facilidadesAtivas.find(
            (item) => normalizarId(item.id) === normalizarId(facilidadeId)
          );

          return facilidade ? academiaPossuiFacilidade(academia, facilidade) : false;
        })
        : true;

      return passaNaBusca && passaNasCategorias && passaNasFacilidades;
    });

    return [...filtradas].sort((a, b) => {
      const notaA = a.nota === null || a.nota === undefined ? -1 : Number(a.nota);
      const notaB = b.nota === null || b.nota === undefined ? -1 : Number(b.nota);

      return notaB - notaA;
    });
  }, [
    academias,
    termoPesquisado,
    categoriasSelecionadas,
    facilidadesSelecionadas,
    categoriasAtivas,
    facilidadesAtivas,
    academiaContemTermo,
    academiaPossuiCategoria,
    academiaPossuiFacilidade,
    normalizarTexto,
    normalizarId
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setTermoPesquisado(searchTerm);
  };

  const alternarCategoria = (categoriaId) => {
    const idNormalizado = normalizarId(categoriaId);

    setCategoriasSelecionadas((categoriasAtuais) => {
      if (categoriasAtuais.includes(idNormalizado)) {
        return categoriasAtuais.filter((item) => item !== idNormalizado);
      }

      return [...categoriasAtuais, idNormalizado];
    });
  };

  const alternarFacilidade = (facilidadeId) => {
    const idNormalizado = normalizarId(facilidadeId);

    setFacilidadesSelecionadas((facilidadesAtuais) => {
      if (facilidadesAtuais.includes(idNormalizado)) {
        return facilidadesAtuais.filter((item) => item !== idNormalizado);
      }

      return [...facilidadesAtuais, idNormalizado];
    });
  };

  const limparBusca = () => {
    setSearchTerm('');
    setTermoPesquisado('');
  };

  const limparTudo = () => {
    setSearchTerm('');
    setTermoPesquisado('');
    setCategoriasSelecionadas([]);
    setFacilidadesSelecionadas([]);
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
      <h1>LOGYM - Encontre sua Academia!</h1>

      <p>
        Descubra as melhores academias perto de você.
        Use a barra de busca para encontrar por nome, local ou especialidade.
      </p>

      {currentUser?.nivelAcesso === 'MANAGER' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '10px',
            padding: '20px',
            margin: '20px auto',
            maxWidth: '800px',
            textAlign: 'center'
          }}
        >
          <h2 style={{ color: '#000000', marginBottom: '10px' }}>
            Área do Gerente
          </h2>

          {verificandoGerente && !gerente ? (
            <p>Verificando cadastro de gerente...</p>
          ) : gerente ? (
            <>
              <p style={{ marginBottom: '15px' }}>
                Seu cadastro de gerente já foi concluído. Agora você pode cadastrar e gerenciar suas academias.
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}
              >
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
              <p style={{ marginBottom: '15px' }}>
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
        <h3>Filtros rápidos</h3>

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
            Resultado: <strong>{academiasFiltradas.length}</strong> academia(s)
          </span>
        </div>
      )}

      {loadingAcademias ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>Carregando academias...</h2>
        </div>
      ) : mensagemAcademias ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px'
          }}
        >
          {mensagemAcademias}
        </div>
      ) : academias.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>Nenhuma academia cadastrada ainda.</h2>
          <p>Quando um gerente cadastrar uma academia, ela aparecerá aqui.</p>
        </div>
      ) : academiasFiltradas.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '30px',
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            borderRadius: '8px'
          }}
        >
          <h2>Nenhuma academia encontrada.</h2>
          <p>Tente pesquisar por outro termo, categoria, bairro ou facilidade.</p>

          <Button
            type="button"
            className="button-primary"
            onClick={limparTudo}
          >
            Ver todas as academias
          </Button>
        </div>
      ) : (
        <div className="academies-grid">
          {academiasFiltradas.map((academia) => (
            <Card
              key={academia.id}
              academy={academia}
              categoriasAtivas={categoriasAtivas}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;




