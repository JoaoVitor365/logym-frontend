// src/pages/Admin/AdminCategoriesSection.jsx
import React, { useState } from 'react';

import Button from '../../components/Button/Button';
import { StatusBadge } from './AdminSharedComponents';

function AdminCategoriesSection({
  categorias,
  onCadastrarCategoria,
  onEditarCategoria,
  onInativarCategoria,
  onReativarCategoria,
  acaoEstaEmAndamento,
  getAcaoKey
}) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);
  const [erroFormulario, setErroFormulario] = useState('');
  const chaveFormulario = categoriaEmEdicao
    ? getAcaoKey('categoria', categoriaEmEdicao.id, 'editar')
    : getAcaoKey('categoria', 'nova', 'cadastrar');
  const salvandoFormulario = acaoEstaEmAndamento(chaveFormulario);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setCategoriaEmEdicao(null);
    setErroFormulario('');
  };

  const iniciarEdicao = (categoria) => {
    setCategoriaEmEdicao(categoria);
    setNome(categoria.nome || '');
    setDescricao(categoria.descricao || '');
    setErroFormulario('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (salvandoFormulario) {
      return;
    }

    const nomeTratado = nome.trim();

    if (!nomeTratado) {
      setErroFormulario('O nome da categoria é obrigatório.');
      return;
    }

    const sucesso = categoriaEmEdicao
      ? await onEditarCategoria(categoriaEmEdicao.id, { nome: nomeTratado, descricao })
      : await onCadastrarCategoria({ nome: nomeTratado, descricao });

    if (sucesso) {
      limparFormulario();
    }
  };

  return (
    <section className="admin-section admin-structure-section">
      <div className="admin-structure-grid">
        <div className="admin-structure-card">
          <span className="admin-section__eyebrow">Gestão de estrutura</span>
          <h2 className="admin-section__title">{categoriaEmEdicao ? 'Editar categoria' : 'Nova categoria'}</h2>
          <p className="admin-structure-card__description">{categoriaEmEdicao ? 'Atualize as informações da categoria selecionada.' : 'Cadastre uma nova categoria disponível para as academias.'}</p>

      <form onSubmit={handleSubmit} className="admin-structure-form">
        <div className="input-group">
          <label htmlFor="nomeCategoria" className="input-label">
            Nome
          </label>
          <input
            id="nomeCategoria"
            name="nomeCategoria"
            type="text"
            className="input-field"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value);
              setErroFormulario('');
            }}
            placeholder="Nome da categoria"
          />
        </div>

        <div className="input-group">
          <label htmlFor="descricaoCategoria" className="input-label">
            Descrição
          </label>
          <textarea
            id="descricaoCategoria"
            name="descricaoCategoria"
            className="textarea-field"
            rows="3"
            value={descricao}
            onChange={(event) => {
              setDescricao(event.target.value);
              setErroFormulario('');
            }}
            placeholder="Descrição da categoria"
          />
        </div>

        {erroFormulario && (
          <div className="admin-message admin-message--error">
            {erroFormulario}
          </div>
        )}

        <div className="admin-actions-row admin-structure-form__actions">
          <Button type="submit" className="button-primary" disabled={salvandoFormulario}>
            {salvandoFormulario ? 'Salvando...' : categoriaEmEdicao ? 'Salvar categoria' : 'Cadastrar categoria'}
          </Button>

          {categoriaEmEdicao && (
            <Button type="button" className="button-cancel" onClick={limparFormulario}>
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
        </div>

        <div className="admin-structure-card admin-structure-list-card">
          <div className="admin-section__heading admin-records-heading">
            <div>
              <span className="admin-section__eyebrow">Registros</span>
              <h2 className="admin-section__title">Categorias cadastradas</h2>
            </div>
            <span className="admin-records-count">{categorias.length} {categorias.length === 1 ? 'registro' : 'registros'}</span>
          </div>
      <div className="admin-table-scroll admin-structure-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categorias.length === 0 ? (
              <tr>
                <td colSpan="4">Nenhuma categoria encontrada.</td>
              </tr>
            ) : (
              categorias.map((categoria) => {
                const estaAtiva = categoria.statusCategoria === 'ATIVO';
                const inativando = acaoEstaEmAndamento(getAcaoKey('categoria', categoria.id, 'inativar'));
                const reativando = acaoEstaEmAndamento(getAcaoKey('categoria', categoria.id, 'reativar'));

                return (
                  <tr key={categoria.id}>
                    <td>{categoria.nome}</td>
                    <td>{categoria.descricao || '-'}</td>
                    <td><StatusBadge status={categoria.statusCategoria} /></td>
                    <td>
                      <div className="admin-actions-row admin-structure-table-actions">
                        <Button type="button" className="button-primary admin-structure-edit-button" onClick={() => iniciarEdicao(categoria)}>
                          Editar
                        </Button>

                        {estaAtiva ? (
                          <Button type="button" className="button-cancel admin-user-action admin-user-action--suspend" onClick={() => onInativarCategoria(categoria.id)} disabled={inativando}>
                            {inativando ? 'Inativando...' : 'Inativar'}
                          </Button>
                        ) : (
                          <Button type="button" className="button-primary admin-user-action admin-entity-reactivate" onClick={() => onReativarCategoria(categoria.id)} disabled={reativando}>
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
        </div>
      </div>
    </section>
  );
}

export default AdminCategoriesSection;

