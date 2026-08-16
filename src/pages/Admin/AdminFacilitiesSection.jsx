// src/pages/Admin/AdminFacilitiesSection.jsx
import React, { useState } from 'react';

import Button from '../../components/Button/Button';
import { StatusBadge } from './AdminSharedComponents';

function AdminFacilitiesSection({
  facilidades,
  onCadastrarFacilidade,
  onEditarFacilidade,
  onInativarFacilidade,
  onReativarFacilidade,
  acaoEstaEmAndamento,
  getAcaoKey
}) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [facilidadeEmEdicao, setFacilidadeEmEdicao] = useState(null);
  const [erroFormulario, setErroFormulario] = useState('');
  const chaveFormulario = facilidadeEmEdicao
    ? getAcaoKey('facilidade', facilidadeEmEdicao.id, 'editar')
    : getAcaoKey('facilidade', 'nova', 'cadastrar');
  const salvandoFormulario = acaoEstaEmAndamento(chaveFormulario);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setFacilidadeEmEdicao(null);
    setErroFormulario('');
  };

  const iniciarEdicao = (facilidade) => {
    setFacilidadeEmEdicao(facilidade);
    setNome(facilidade.nome || '');
    setDescricao(facilidade.descricao || '');
    setErroFormulario('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (salvandoFormulario) {
      return;
    }

    const nomeTratado = nome.trim();

    if (!nomeTratado) {
      setErroFormulario('O nome da facilidade é obrigatório.');
      return;
    }

    const sucesso = facilidadeEmEdicao
      ? await onEditarFacilidade(facilidadeEmEdicao.id, { nome: nomeTratado, descricao })
      : await onCadastrarFacilidade({ nome: nomeTratado, descricao });

    if (sucesso) {
      limparFormulario();
    }
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Facilidades cadastradas</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nomeFacilidade" className="input-label">
            Nome
          </label>
          <input
            id="nomeFacilidade"
            name="nomeFacilidade"
            type="text"
            className="input-field"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value);
              setErroFormulario('');
            }}
            placeholder="Nome da facilidade"
          />
        </div>

        <div className="input-group">
          <label htmlFor="descricaoFacilidade" className="input-label">
            Descrição
          </label>
          <textarea
            id="descricaoFacilidade"
            name="descricaoFacilidade"
            className="textarea-field"
            rows="3"
            value={descricao}
            onChange={(event) => {
              setDescricao(event.target.value);
              setErroFormulario('');
            }}
            placeholder="Descrição da facilidade"
          />
        </div>

        {erroFormulario && (
          <div className="admin-message admin-message--error">
            {erroFormulario}
          </div>
        )}

        <div className="admin-actions-row">
          <Button type="submit" className="button-primary" disabled={salvandoFormulario}>
            {salvandoFormulario ? 'Salvando...' : facilidadeEmEdicao ? 'Salvar facilidade' : 'Cadastrar facilidade'}
          </Button>

          {facilidadeEmEdicao && (
            <Button type="button" className="button-cancel" onClick={limparFormulario}>
              Cancelar edição
            </Button>
          )}
        </div>
      </form>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Facilidade</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {facilidades.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhuma facilidade encontrada.</td>
              </tr>
            ) : (
              facilidades.map((facilidade) => {
                const estaAtiva = facilidade.statusFacilidade === 'ATIVO';
                const inativando = acaoEstaEmAndamento(getAcaoKey('facilidade', facilidade.id, 'inativar'));
                const reativando = acaoEstaEmAndamento(getAcaoKey('facilidade', facilidade.id, 'reativar'));

                return (
                  <tr key={facilidade.id}>
                    <td>{facilidade.nome}</td>
                    <td>{facilidade.descricao || '-'}</td>
                    <td><StatusBadge status={facilidade.statusFacilidade} /></td>
                    <td>
                      <div className="admin-actions-row">
                        <Button type="button" className="button-primary" onClick={() => iniciarEdicao(facilidade)}>
                          Editar
                        </Button>

                        {estaAtiva ? (
                          <Button type="button" className="button-cancel" onClick={() => onInativarFacilidade(facilidade.id)} disabled={inativando}>
                            {inativando ? 'Inativando...' : 'Inativar'}
                          </Button>
                        ) : (
                          <Button type="button" className="button-primary" onClick={() => onReativarFacilidade(facilidade.id)} disabled={reativando}>
                            {reativando ? 'Reativando...' : 'Reativar'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminFacilitiesSection;

