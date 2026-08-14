// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import GerenteService from '../../services/GerenteService';
import AcademiaService from '../../services/AcademiaService';

function HomePage({ currentUser }) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [termoPesquisado, setTermoPesquisado] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState([]);

  const [gerente, setGerente] = useState(null);
  const [verificandoGerente, setVerificandoGerente] = useState(false);

  const [academias, setAcademias] = useState([]);
  const [loadingAcademias, setLoadingAcademias] = useState(true);
  const [mensagemAcademias, setMensagemAcademias] = useState('');

  const filtros = [
    'Musculação',
    'Crossfit',
    'Pilates',
    'Yoga',
    'Funcional',
    'Natação',
    'Lutas',
    'Dança',
    'Spinning',
    'Wi-Fi',
    'Estacionamento',
    'Acessibilidade',
    'Ar Condicionado',
    'Vestiário'
  ];

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

  const normalizarTexto = (texto) => {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const academiaContemTermo = (academia, termo) => {
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
      ${academia.facilidades}
    `);

    return textoPesquisavel.includes(termo);
  };

  const academiasFiltradas = useMemo(() => {
    const termoBusca = normalizarTexto(termoPesquisado.trim());

    const listaAcademias = Array.isArray(academias) ? academias : [];

    const filtradas = listaAcademias.filter((academia) => {
      const passaNaBusca = termoBusca
        ? academiaContemTermo(academia, termoBusca)
        : true;

      const passaNosFiltros = filtrosAtivos.length > 0
        ? filtrosAtivos.every((filtro) =>
          academiaContemTermo(academia, normalizarTexto(filtro))
        )
        : true;

      return passaNaBusca && passaNosFiltros;
    });

    return [...filtradas].sort((a, b) => {
      const notaA = a.nota === null || a.nota === undefined ? -1 : Number(a.nota);
      const notaB = b.nota === null || b.nota === undefined ? -1 : Number(b.nota);

      return notaB - notaA;
    });
  }, [
    academias,
    termoPesquisado,
    filtrosAtivos
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setTermoPesquisado(searchTerm);
  };

  const aplicarFiltro = (filtro) => {
    setFiltrosAtivos((filtrosAtuais) => {
      if (filtrosAtuais.includes(filtro)) {
        return filtrosAtuais.filter((item) => item !== filtro);
      }

      return [...filtrosAtuais, filtro];
    });
  };

  const limparBusca = () => {
    setSearchTerm('');
    setTermoPesquisado('');
  };

  const limparTudo = () => {
    setSearchTerm('');
    setTermoPesquisado('');
    setFiltrosAtivos([]);
  };

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
          placeholder="Ex: Musculação, Crossfit, Paulista, Wi-Fi, Consolação"
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
          {filtros.map((filtro) => (
            <button
              key={filtro}
              type="button"
              className={`home-filter-button ${filtrosAtivos.includes(filtro) ? 'active' : ''}`}
              onClick={() => aplicarFiltro(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>

        {(termoPesquisado || filtrosAtivos.length > 0) && (
          <button
            type="button"
            className="home-clear-filters-button"
            onClick={limparTudo}
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {(termoPesquisado || filtrosAtivos.length > 0) && !loadingAcademias && (
        <div className="home-search-summary">
          {termoPesquisado && (
            <span>
              Busca: <strong>{termoPesquisado}</strong>
            </span>
          )}

          {filtrosAtivos.length > 0 && (
            <span>
              Filtros: <strong>{filtrosAtivos.join(' + ')}</strong>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;