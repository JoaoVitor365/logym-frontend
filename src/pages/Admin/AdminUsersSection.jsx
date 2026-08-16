// src/pages/Admin/AdminUsersSection.jsx
import React, { useMemo, useState } from 'react';

import Button from '../../components/Button/Button';
import { StatusBadge } from './AdminSharedComponents';
import { formatarData, getStatusUsuarioVisual } from './adminFormatters';

function AdminUsersSection({ usuarios, currentUser, onSuspenderUsuario, onAtivarUsuario, acaoEstaEmAndamento, getAcaoKey }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState('TODOS');
  const [statusSelecionado, setStatusSelecionado] = useState('TODOS');

  const normalizarTexto = (valor) =>
    String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const ordenarOpcoes = (opcoes, ordem) =>
    [...opcoes].sort((a, b) => {
      const indiceA = ordem.indexOf(a);
      const indiceB = ordem.indexOf(b);

      if (indiceA === -1 && indiceB === -1) return a.localeCompare(b);
      if (indiceA === -1) return 1;
      if (indiceB === -1) return -1;
      return indiceA - indiceB;
    });

  const statusDisponiveis = useMemo(() => {
    const status = usuarios
      .map((usuario) => usuario.statusUsuario)
      .filter(Boolean);

    return ordenarOpcoes([...new Set(status)], ['ATIVO', 'INATIVO', 'SUSPENSO']);
  }, [usuarios]);

  const usuariosFiltrados = useMemo(() => {
    const termoNormalizado = normalizarTexto(termoBusca);

    return usuarios.filter((usuario) => {
      const correspondeBusca = !termoNormalizado || [
        usuario.nome,
        usuario.username,
        usuario.email
      ].some((valor) => normalizarTexto(valor).includes(termoNormalizado));
      const correspondeNivel = nivelSelecionado === 'TODOS' || usuario.nivelAcesso === nivelSelecionado;
      const correspondeStatus = statusSelecionado === 'TODOS' || usuario.statusUsuario === statusSelecionado;

      return correspondeBusca && correspondeNivel && correspondeStatus;
    });
  }, [usuarios, termoBusca, nivelSelecionado, statusSelecionado]);

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Usuários cadastrados</h2>

      <div className="admin-actions-row">
        <div className="input-group">
          <label htmlFor="buscaUsuariosAdmin" className="input-label">
            Buscar
          </label>
          <input
            id="buscaUsuariosAdmin"
            name="buscaUsuariosAdmin"
            type="text"
            className="input-field"
            value={termoBusca}
            onChange={(event) => setTermoBusca(event.target.value)}
            placeholder="Nome ou e-mail"
          />
        </div>

        <div className="input-group">
          <label htmlFor="nivelUsuariosAdmin" className="input-label">
            Nível
          </label>
          <select
            id="nivelUsuariosAdmin"
            name="nivelUsuariosAdmin"
            className="input-field"
            value={nivelSelecionado}
            onChange={(event) => setNivelSelecionado(event.target.value)}
          >
            <option value="TODOS">TODOS</option>
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="statusUsuariosAdmin" className="input-label">
            Status
          </label>
          <select
            id="statusUsuariosAdmin"
            name="statusUsuariosAdmin"
            className="input-field"
            value={statusSelecionado}
            onChange={(event) => setStatusSelecionado(event.target.value)}
          >
            <option value="TODOS">TODOS</option>
            {statusDisponiveis.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Nível</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum usuário encontrado.</td>
              </tr>
            ) : usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum usuário encontrado para os filtros selecionados.</td>
              </tr>
            ) : (
              usuariosFiltrados.map((usuario) => {
                const usuarioLogado = currentUser || JSON.parse(localStorage.getItem('user'));
                const ehContaAtual = usuarioLogado?.id === usuario.id;
                const suspendendo = acaoEstaEmAndamento(getAcaoKey('usuario', usuario.id, 'suspender'));
                const reativando = acaoEstaEmAndamento(getAcaoKey('usuario', usuario.id, 'reativar'));

                return (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.username}</td>
                    <td>{usuario.nivelAcesso}</td>
                    <td><StatusBadge status={getStatusUsuarioVisual(usuario.statusUsuario)} /></td>
                    <td>{formatarData(usuario.dataCadastro)}</td>
                    <td>
                      {usuario.statusUsuario === 'ATIVO' ? (
                        <Button type="button" className="button-cancel" onClick={() => onSuspenderUsuario(usuario.id)} disabled={ehContaAtual || suspendendo}>
                          {suspendendo ? 'Suspendendo...' : 'Suspender'}
                        </Button>
                      ) : (
                        <Button type="button" className="button-primary" onClick={() => onAtivarUsuario(usuario.id)} disabled={reativando}>
                          {reativando ? 'Reativando...' : 'Reativar'}
                        </Button>
                      )}
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

export default AdminUsersSection;
