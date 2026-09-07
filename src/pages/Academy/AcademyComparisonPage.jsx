import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AcademiaService from '../../services/AcademiaService';
import { useComparison } from '../../contexts/useComparison';
import { getFotoPrincipalUrl } from '../../utils/academyPhoto';

const formatarNumero = (valor, casas = 1) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: casas,
  maximumFractionDigits: casas
}).format(Number(valor));

const formatarDistancia = (distanciaKm) => {
  if (distanciaKm === null || distanciaKm === undefined || !Number.isFinite(Number(distanciaKm))) {
    return '—';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(Number(distanciaKm))} km`;
};

const montarEndereco = (academia) => {
  const linha1 = [academia.endereco, academia.numero].filter(Boolean).join(', ');
  const linha2 = [academia.bairro, academia.cidade, academia.estado].filter(Boolean).join(' - ');

  return linha1 || linha2 ? [linha1, linha2].filter(Boolean).join(', ') : 'Endereço não informado';
};

const criarLinhas = (academias, propriedade) => {
  const itens = new Map();

  academias.forEach((academia) => {
    (Array.isArray(academia[propriedade]) ? academia[propriedade] : []).forEach((item) => {
      const nome = item?.nome?.trim();

      if (nome) {
        itens.set(String(item.id ?? nome), { chave: String(item.id ?? nome), nome });
      }
    });
  });

  return [...itens.values()];
};

const academiaPossuiItem = (academia, propriedade, chave) => (
  (Array.isArray(academia[propriedade]) ? academia[propriedade] : []).some((item) => (
    String(item.id ?? item.nome) === chave
  ))
);

function AcademyComparisonPage({ currentUser }) {
  const {
    academiasSelecionadas,
    podeComparar,
    removerAcademia
  } = useComparison();
  const [academias, setAcademias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const idsSelecionados = useMemo(
    () => academiasSelecionadas.map((academia) => academia.id),
    [academiasSelecionadas]
  );

  useEffect(() => {
    let ativo = true;

    const carregarComparacao = async () => {
      if (!podeComparar || idsSelecionados.length < 2) {
        setAcademias([]);
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setMensagem('');

      try {
        const response = await AcademiaService.getAcademiasComparacao(idsSelecionados);
        const recebidas = Array.isArray(response.data) ? response.data : [];
        const porId = new Map(recebidas.map((academia) => [String(academia.id), academia]));
        const ordenadas = idsSelecionados
          .map((id) => porId.get(String(id)))
          .filter(Boolean);

        if (!ativo) return;

        if (ordenadas.length === 0) {
          setMensagem('Nenhuma academia selecionada está disponível para comparação.');
        }

        setAcademias(ordenadas);
      } catch (error) {
        if (!ativo) return;

        const status = error.response?.status;
        const mensagensPorStatus = {
          400: 'Não foi possível comparar as academias selecionadas.',
          403: 'Você não tem permissão para comparar academias.',
          404: 'Uma ou mais academias selecionadas não estão disponíveis.'
        };

        setAcademias([]);
        setMensagem(mensagensPorStatus[status] || 'Não foi possível carregar a comparação. Tente novamente.');
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarComparacao();

    return () => {
      ativo = false;
    };
  }, [idsSelecionados, podeComparar]);

  const criterios = useMemo(() => criarLinhas(academias, 'criterios'), [academias]);
  const categorias = useMemo(() => criarLinhas(academias, 'categorias'), [academias]);
  const facilidades = useMemo(() => criarLinhas(academias, 'facilidades'), [academias]);
  const maiorNota = useMemo(() => {
    const notas = academias
      .map((academia) => academia.nota)
      .filter((nota) => nota !== null && nota !== undefined && Number.isFinite(Number(nota)));

    return notas.length > 0 ? Math.max(...notas.map(Number)) : null;
  }, [academias]);
  const menorDistancia = useMemo(() => {
    const distancias = academias
      .map((academia) => academia.distanciaKm)
      .filter((distancia) => distancia !== null && distancia !== undefined && Number.isFinite(Number(distancia)));

    return distancias.length > 0 ? Math.min(...distancias.map(Number)) : null;
  }, [academias]);

  if (currentUser?.nivelAcesso !== 'USER') {
    return (
      <div className="academy-comparison-page academy-comparison-state">
        <h1>Comparação de academias</h1>
        <p>Esta funcionalidade está disponível apenas para usuários comuns.</p>
        <Link to="/" className="back-button">Voltar para academias</Link>
      </div>
    );
  }

  if (academiasSelecionadas.length < 2) {
    return (
      <div className="academy-comparison-page academy-comparison-state">
        <h1>Comparação de academias</h1>
        <p>Selecione pelo menos 2 academias para iniciar uma comparação.</p>
        <Link to="/" className="back-button">Voltar para academias</Link>
      </div>
    );
  }

  const encontrarCriterio = (academia, chave) => (
    (Array.isArray(academia.criterios) ? academia.criterios : []).find(
      (criterio) => String(criterio.id ?? criterio.nome) === chave
    )
  );

  const maiorMediaDoCriterio = (chave) => {
    const medias = academias
      .map((academia) => encontrarCriterio(academia, chave)?.media)
      .filter((media) => media !== null && media !== undefined && Number.isFinite(Number(media)));

    return medias.length > 0 ? Math.max(...medias.map(Number)) : null;
  };

  return (
    <div className="academy-comparison-page">
      <Link to="/" className="back-button">Voltar para academias</Link>
      <h1>Comparação de academias</h1>

      {carregando ? (
        <div className="academy-comparison-feedback">Carregando comparação...</div>
      ) : mensagem ? (
        <div className="academy-comparison-feedback academy-comparison-feedback-error">
          <p>{mensagem}</p>
          <Link to="/" className="button button-primary">Voltar para academias</Link>
        </div>
      ) : (
        <>
          <section className="comparison-summary" aria-label="Resumo das academias">
            {academias.map((academia) => {
              const notaEmDestaque = maiorNota !== null && Number(academia.nota) === maiorNota;
              const distanciaEmDestaque = menorDistancia !== null && Number(academia.distanciaKm) === menorDistancia;
              const fotoPrincipalUrl = getFotoPrincipalUrl(academia.fotoPrincipal);

              return (
                <article className="comparison-summary-card" key={academia.id}>
                  {fotoPrincipalUrl ? (
                    <img src={fotoPrincipalUrl} alt={`Foto da academia ${academia.nome}`} className="comparison-summary-image" />
                  ) : (
                    <div className="card-image-placeholder comparison-summary-placeholder">
                      <span>{academia.nome?.charAt(0)?.toUpperCase() || 'A'}</span>
                    </div>
                  )}

                  <h2>{academia.nome}</h2>
                  <p className={notaEmDestaque ? 'comparison-value-highlight' : ''}>
                    <strong>Nota:</strong> {academia.nota === null || academia.nota === undefined
                      ? 'Sem avaliações'
                      : formatarNumero(academia.nota)}
                  </p>
                  <p className={distanciaEmDestaque ? 'comparison-value-highlight' : ''}>
                    <strong>Distância:</strong> {formatarDistancia(academia.distanciaKm)}
                  </p>
                  <p><strong>Localização:</strong> {montarEndereco(academia)}</p>
                  <div className="comparison-summary-actions">
                    <Link to={`/academia/${academia.id}`} className="button button-primary">Ver academia</Link>
                    <button type="button" className="button button-outline" onClick={() => removerAcademia(academia.id)}>
                      Remover
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <ComparisonTable
            title="Avaliações por critério"
            academias={academias}
            linhas={criterios}
            renderValue={(academia, linha) => {
              const criterio = encontrarCriterio(academia, linha.chave);
              const maiorMedia = maiorMediaDoCriterio(linha.chave);
              const mediaValida = criterio?.media !== null && criterio?.media !== undefined && Number.isFinite(Number(criterio?.media));

              return {
                conteudo: mediaValida ? formatarNumero(criterio.media) : 'Sem avaliações',
                destaque: mediaValida && maiorMedia !== null && Number(criterio.media) === maiorMedia
              };
            }}
          />

          <ComparisonTable
            title="Categorias e modalidades"
            academias={academias}
            linhas={categorias}
            renderValue={(academia, linha) => ({
              conteudo: academiaPossuiItem(academia, 'categorias', linha.chave) ? '✓' : '✕',
              destaque: false
            })}
          />

          <ComparisonTable
            title="Facilidades"
            academias={academias}
            linhas={facilidades}
            renderValue={(academia, linha) => ({
              conteudo: academiaPossuiItem(academia, 'facilidades', linha.chave) ? '✓' : '✕',
              destaque: false
            })}
          />
        </>
      )}
    </div>
  );
}

function ComparisonTable({ title, academias, linhas, renderValue }) {
  return (
    <section className="comparison-section">
      <h2>{title}</h2>
      {linhas.length === 0 ? (
        <p className="comparison-empty">Nenhuma informação disponível.</p>
      ) : (
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                {academias.map((academia) => (
                  <th scope="col" key={academia.id}>{academia.nome}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha.chave}>
                  <th scope="row">{linha.nome}</th>
                  {academias.map((academia) => {
                    const valor = renderValue(academia, linha);

                    return (
                      <td className={valor.destaque ? 'comparison-value-highlight' : ''} key={academia.id}>
                        {valor.conteudo}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AcademyComparisonPage;
