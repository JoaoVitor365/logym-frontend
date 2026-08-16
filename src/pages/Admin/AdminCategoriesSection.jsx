// src/pages/Admin/AdminCategoriesSection.jsx
import React, { useState } from 'react';

import Button from '../../components/Button/Button';
import { StatusBadge } from './AdminSharedComponents';

function AdminCategoriesSection({
  categorias,
  onCadastrarCategoria,
  onEditarCategoria,
  onInativarCategoria,
  onReativarCategoria
}) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);
  const [erroFormulario, setErroFormulario] = useState('');

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
    <section className="admin-section">
      <h2 className="admin-section__title">Categorias cadastradas</h2>

      <form onSubmit={handleSubmit}>
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

        <div className="admin-actions-row">
          <Button type="submit" className="button-primary">
            {categoriaEmEdicao ? 'Salvar categoria' : 'Cadastrar categoria'}
          </Button>

          {categoriaEmEdicao && (
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

                return (
                  <tr key={categoria.id}>
                    <td>{categoria.nome}</td>
                    <td>{categoria.descricao || '-'}</td>
                    <td><StatusBadge status={categoria.statusCategoria} /></td>
                    <td>
                      <div className="admin-actions-row">
                        <Button type="button" className="button-primary" onClick={() => iniciarEdicao(categoria)}>
                          Editar
                        </Button>

                        {estaAtiva ? (
                          <Button type="button" className="button-cancel" onClick={() => onInativarCategoria(categoria.id)}>
                            Inativar
                          </Button>
                        ) : (
                          <Button type="button" className="button-primary" onClick={() => onReativarCategoria(categoria.id)}>
                            Reativar
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

export default AdminCategoriesSection;

