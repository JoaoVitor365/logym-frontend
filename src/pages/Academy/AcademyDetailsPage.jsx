// src/pages/AcademyDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import AcademyReviews from '../../components/Academy/AcademyReviews';
import AcademiaService from '../../services/AcademiaService';
import AvaliacaoService from '../../services/AvaliacaoService';
import FotoAcademiaService from '../../services/FotoAcademiaService';

function AcademyDetailsPage() {
  const { id } = useParams();

  const [academy, setAcademy] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [itensAvaliacao, setItensAvaliacao] = useState([]);
  const [notasItens, setNotasItens] = useState({});
  const [hoverNotasItens, setHoverNotasItens] = useState({});

  const [loading, setLoading] = useState(true);
  const [avaliando, setAvaliando] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [modoEdicaoAvaliacao, setModoEdicaoAvaliacao] = useState(false);

  const usuarioLogado = JSON.parse(localStorage.getItem('user'));
  const podeAvaliar = usuarioLogado?.nivelAcesso === 'USER';
  const isAdmin = usuarioLogado?.nivelAcesso === 'ADMIN';

  useEffect(() => {
    carregarDados();
  }, [id]);

  const montarNotasVazias = (itens) => {
    const notas = {};

    itens.forEach((item) => {
      notas[item.id] = '';
    });

    return notas;
  };

  const carregarDados = async () => {
    setLoading(true);
    setApiMessage('');

    try {
      const usuarioAtual = JSON.parse(localStorage.getItem('user'));

      const [academiaResponse, avaliacoesResponse, fotosResponse, itensResponse] = await Promise.all([
        AcademiaService.findById(id),
        AvaliacaoService.findByAcademiaId(id, usuarioAtual?.id || null),
        FotoAcademiaService.listarPorAcademia(id),
        AvaliacaoService.findItensAvaliacao()
      ]);

      const itens = Array.isArray(itensResponse.data) ? itensResponse.data : [];

      setAcademy(academiaResponse.data);
      setReviews(Array.isArray(avaliacoesResponse.data) ? avaliacoesResponse.data : []);
      setFotos(Array.isArray(fotosResponse.data) ? fotosResponse.data : []);
      setItensAvaliacao(itens);
      setNotasItens(montarNotasVazias(itens));
    } catch (error) {
      console.error('Erro ao carregar detalhes da academia:', error);
      setApiMessage('Erro ao carregar detalhes da academia.');
      setAcademy(null);
    } finally {
      setLoading(false);
    }
  };

  const formatarCEP = (cep) => {
    if (!cep) return 'Não informado';

    const numeros = String(cep).replace(/\D/g, '');

    if (numeros.length !== 8) {
      return cep;
    }

    return numeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };

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

  const montarEnderecoCompleto = () => {
    if (!academy) return 'Endereço não informado';

    const linha1 = [
      academy.endereco,
      academy.numero ? `nº ${academy.numero}` : null,
      academy.complemento
    ].filter(Boolean).join(', ');

    const linha2 = [
      academy.bairro,
      academy.cidade,
      academy.estado
    ].filter(Boolean).join(' - ');

    if (linha1 && linha2) {
      return `${linha1}, ${linha2}`;
    }

    return linha1 || linha2 || 'Endereço não informado';
  };

  const getNota = () => {
    if (academy?.nota === null || academy?.nota === undefined) {
      return null;
    }

    return Number(academy.nota).toFixed(1);
  };

  const transformarTextoEmLista = (texto) => {
    if (!texto) return [];

    return texto
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleAlterarNotaItem = (itemId, nota) => {
    setNotasItens((notasAtuais) => ({
      ...notasAtuais,
      [itemId]: nota
    }));
  };


  const renderEstrelasAvaliacao = (item) => {
    const notaSelecionada = Number(notasItens[item.id] || 0);
    const notaHover = Number(hoverNotasItens[item.id] || 0);
    const notaVisual = notaHover || notaSelecionada;

    return (
      <div
        className="review-star-rating"
        role="radiogroup"
        aria-label={`Nota para ${item.nome}`}
        onMouseLeave={() => {
          setHoverNotasItens((notasAtuais) => ({
            ...notasAtuais,
            [item.id]: 0
          }));
        }}
      >
        {[1, 2, 3, 4, 5].map((estrela) => (
          <button
            key={estrela}
            type="button"
            className={`review-star-button ${notaVisual >= estrela ? 'review-star-button-active' : ''}`}
            onClick={() => handleAlterarNotaItem(item.id, String(estrela))}
            onMouseEnter={() => {
              setHoverNotasItens((notasAtuais) => ({
                ...notasAtuais,
                [item.id]: estrela
              }));
            }}
            aria-label={`${estrela} estrela${estrela > 1 ? 's' : ''}`}
            title={`${estrela} estrela${estrela > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}

        <span className="review-star-value">
          {notaSelecionada > 0 ? `${notaSelecionada}/5` : 'Selecione uma nota'}
        </span>
      </div>
    );
  };

  const validarNotasDosItens = () => {
    if (itensAvaliacao.length === 0) {
      setReviewMessage('Nenhum item de avaliação foi cadastrado.');
      return false;
    }

    const existeItemSemNota = itensAvaliacao.some((item) => !notasItens[item.id]);

    if (existeItemSemNota) {
      setReviewMessage('Avalie todos os critérios antes de enviar.');
      return false;
    }

    const existeNotaInvalida = itensAvaliacao.some((item) => {
      const notaNumerica = Number(notasItens[item.id]);
      return notaNumerica < 1 || notaNumerica > 5;
    });

    if (existeNotaInvalida) {
      setReviewMessage('Todas as notas devem estar entre 1 e 5.');
      return false;
    }

    return true;
  };

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    setReviewMessage('');

    if (!usuarioLogado) {
      setReviewMessage('Faça login para avaliar esta academia.');
      return;
    }

    if (usuarioLogado.nivelAcesso !== 'USER') {
      setReviewMessage('Apenas usuários comuns podem avaliar academias.');
      return;
    }

    if (academy?.statusAcademia === 'SUSPENSA') {
      setReviewMessage('Esta academia foi suspensa pela administração e não pode receber avaliações.');
      return;
    }

    if (!validarNotasDosItens()) {
      return;
    }

    const itens = itensAvaliacao.map((item) => ({
      itemId: item.id,
      nota: Number(notasItens[item.id])
    }));

    setAvaliando(true);

    try {
      await AvaliacaoService.avaliar(usuarioLogado.id, id, { itens });

      setReviewMessage(
        modoEdicaoAvaliacao
          ? 'Avaliação atualizada com sucesso!'
          : 'Avaliação enviada com sucesso!'
      );

      setNotasItens(montarNotasVazias(itensAvaliacao));
      setModoEdicaoAvaliacao(false);

      await carregarDados();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao enviar avaliação.';

      setReviewMessage(`Erro: ${mensagemErro}`);
    } finally {
      setAvaliando(false);
    }
  };

  const handleRemoverAvaliacao = async (avaliacaoId) => {
    const avaliacao = reviews.find((review) => Number(review.id) === Number(avaliacaoId));

    if (avaliacao?.statusAvaliacao === 'SUSPENSA') {
      setReviewMessage('Esta avaliação foi suspensa pela administração e não pode ser removida pelo usuário.');
      return;
    }

    const confirmar = window.confirm(
      'Tem certeza que deseja remover sua avaliação? As notas dos critérios deixarão de aparecer e não entrarão mais na média da academia.'
    );

    if (!confirmar) {
      return;
    }

    setReviewMessage('');

    try {
      await AvaliacaoService.inativar(avaliacaoId, usuarioLogado.id);

      setReviewMessage('Avaliação removida com sucesso!');
      setNotasItens(montarNotasVazias(itensAvaliacao));
      setModoEdicaoAvaliacao(false);

      await carregarDados();
    } catch (error) {
      console.error('Erro ao remover avaliação:', error);

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao remover avaliação.';

      setReviewMessage(`Erro: ${mensagemErro}`);
    }
  };

  const handleEditarAvaliacao = (avaliacao) => {
    if (avaliacao?.statusAvaliacao === 'SUSPENSA') {
      setReviewMessage('Esta avaliação foi suspensa pela administração e não pode ser editada. Entre em contato com o suporte.');
      return;
    }

    const novasNotas = montarNotasVazias(itensAvaliacao);

    if (Array.isArray(avaliacao.itens)) {
      avaliacao.itens.forEach((item) => {
        novasNotas[item.itemId] = String(Number(item.nota));
      });
    }

    setNotasItens(novasNotas);
    setModoEdicaoAvaliacao(true);
    setReviewMessage('');

    setTimeout(() => {
      const form = document.getElementById('form-avaliacao');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="academy-details-page academy-details-state">
        <p>Carregando detalhes da academia...</p>
      </div>
    );
  }

  if (apiMessage || !academy) {
    return (
      <div className="academy-details-page academy-details-state">
        <p>{apiMessage || 'Academia não encontrada.'}</p>
        <Link to="/" className="back-button">Voltar para a Busca</Link>
      </div>
    );
  }

  if (academy.statusAcademia === 'SUSPENSA' && !isAdmin) {
    return (
      <div className="academy-details-page academy-details-state">
        <Link to="/" className="back-button">← Voltar para a Busca</Link>

        <div className="academy-suspended-box">
          <h1 className="academy-suspended-title">Academia suspensa</h1>
          <p>
            Esta academia foi suspensa pela administração da LOGYM. Ela não está disponível para usuários comuns no momento.
          </p>
          <p>
            Para mais informações, entre em contato com o suporte.
          </p>
        </div>
      </div>
    );
  }

  const categorias = transformarTextoEmLista(academy.categorias);
  const facilidades = transformarTextoEmLista(academy.facilidades);
  const avaliacaoDoUsuarioLogado = reviews.find(
    (review) => Number(review.usuarioId) === Number(usuarioLogado?.id)
  );
  const avaliacaoDoUsuarioSuspensa = avaliacaoDoUsuarioLogado?.statusAvaliacao === 'SUSPENSA';

  return (
    <div className="academy-details-page">
      <Link to="/" className="back-button">← Voltar para a Busca</Link>

      {academy.statusAcademia === 'SUSPENSA' && isAdmin && (
        <div className="academy-admin-warning">
          Esta academia está suspensa. Somente administradores conseguem visualizá-la normalmente.
        </div>
      )}

      <div className="academy-details-header">
        <div className="card-image-placeholder academy-details-placeholder">
          <span>{academy.nome?.charAt(0)?.toUpperCase() || 'A'}</span>
        </div>

        <h1>{academy.nome}</h1>

        <p>{montarEnderecoCompleto()}</p>

        <p>
          {getNota() ? (
            <>Avaliação: {getNota()} ⭐</>
          ) : (
            <>Sem avaliações</>
          )}
        </p>
      </div>

      <div className="academy-details-section">
        <h2>Sobre a Academia</h2>
        <p>{academy.descricao}</p>
      </div>

      <div className="academy-details-section academy-details-info">
        <h2>Informações da Academia</h2>

        <ul>
          <li><strong>CNPJ:</strong> {formatarCNPJ(academy.cnpj)}</li>
          <li><strong>CEP:</strong> {formatarCEP(academy.cep)}</li>
          <li><strong>Endereço:</strong> {montarEnderecoCompleto()}</li>
        </ul>
      </div>

      <div className="academy-details-section academy-details-info">
        <h2>Informações de Contato</h2>

        <ul>
          <li><strong>Telefone:</strong> {academy.telefone || 'Não informado'}</li>
          <li><strong>Celular:</strong> {academy.celular || 'Não informado'}</li>
          <li>
            <strong>E-mail:</strong>{' '}
            {academy.email ? (
              <a href={`mailto:${academy.email}`}>{academy.email}</a>
            ) : (
              'Não informado'
            )}
          </li>
        </ul>
      </div>

      <div className="academy-details-section academy-details-info">
        <h2>Categorias</h2>

        {categorias.length > 0 ? (
          <ul>
            {categorias.map((categoria, index) => (
              <li key={index}>{categoria}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma categoria informada.</p>
        )}
      </div>

      <div className="academy-details-section academy-details-info">
        <h2>Facilidades</h2>

        {facilidades.length > 0 ? (
          <ul>
            {facilidades.map((facilidade, index) => (
              <li key={index}>{facilidade}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma facilidade informada.</p>
        )}
      </div>

      <div className="academy-details-section">
        <h2>Galeria de Fotos</h2>

        {fotos.length === 0 ? (
          <p>Esta academia ainda não possui fotos cadastradas.</p>
        ) : (
          <div className="academy-photo-gallery">
            {fotos.map((foto) => (
              <img
                key={foto.id}
                src={FotoAcademiaService.getImagemUrl(foto.id)}
                alt={`Foto da academia ${academy.nome}`}
                className="academy-photo-gallery-image"
              />
            ))}
          </div>
        )}
      </div>

      {podeAvaliar && (
        <div className="academy-details-section review-form-section" id="form-avaliacao">
          <h2>
            {avaliacaoDoUsuarioLogado
              ? modoEdicaoAvaliacao
                ? 'Editar Avaliação'
                : 'Sua Avaliação'
              : 'Avaliar Academia'}
          </h2>

          {reviewMessage && (
            <p className={`academy-review-message ${reviewMessage.startsWith('Erro') ? 'academy-review-message-error' : 'academy-review-message-success'}`}>
              {reviewMessage}
            </p>
          )}

          {avaliacaoDoUsuarioSuspensa ? (
            <div className="academy-review-suspended-warning">
              Sua avaliação foi suspensa pela administração. Ela não aparece para outros usuários e não conta na média da academia.
              Entre em contato com o suporte para mais informações.
            </div>
          ) : avaliacaoDoUsuarioLogado && !modoEdicaoAvaliacao ? (
            <div>
              <p>
                Você já avaliou esta academia. Para alterar as notas dos critérios,
                clique em <strong>Editar minha avaliação</strong>.
              </p>

              <button
                type="button"
                className="review-edit-main-button"
                onClick={() => handleEditarAvaliacao(avaliacaoDoUsuarioLogado)}
              >
                Editar minha avaliação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitAvaliacao} className="review-form">
              <p className="review-form-help">
                Avalie todos os critérios abaixo. Nenhum item pode ficar sem nota.
              </p>

              {itensAvaliacao.map((item) => (
                <div key={item.id} className="review-item-field">
                  <label htmlFor={`item-avaliacao-${item.id}`}>{item.nome}</label>

                  {item.descricao && (
                    <small>{item.descricao}</small>
                  )}

                  {renderEstrelasAvaliacao(item)}
                </div>
              ))}

              <div className="review-form-actions">
                <button type="submit" className="review-submit-button" disabled={avaliando}>
                  {avaliando
                    ? 'Enviando...'
                    : modoEdicaoAvaliacao
                      ? 'Salvar Alterações'
                      : 'Enviar Avaliação'}
                </button>

                {modoEdicaoAvaliacao && (
                  <button
                    type="button"
                    className="review-cancel-edit-button"
                    onClick={() => {
                      setModoEdicaoAvaliacao(false);
                      setNotasItens(montarNotasVazias(itensAvaliacao));
                      setReviewMessage('');
                    }}
                  >
                    Cancelar edição
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {!usuarioLogado && (
        <div className="academy-details-section">
          <p>Faça login como usuário comum para avaliar esta academia.</p>
        </div>
      )}

      <AcademyReviews
        reviews={reviews}
        currentUser={usuarioLogado}
        onRemoveReview={handleRemoverAvaliacao}
        onEditReview={handleEditarAvaliacao}
      />
    </div>
  );
}

export default AcademyDetailsPage;
