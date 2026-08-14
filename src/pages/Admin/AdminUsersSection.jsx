// src/pages/Admin/AdminUsersSection.jsx
import React from 'react';

import Button from '../../components/Button/Button';
import { StatusBadge } from './AdminSharedComponents';
import { formatarData, getStatusUsuarioVisual } from './adminFormatters';

function AdminUsersSection({ usuarios, currentUser, onSuspenderUsuario, onAtivarUsuario }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__title">Usuários cadastrados</h2>

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
            ) : (
              usuarios.map((usuario) => {
                const usuarioLogado = currentUser || JSON.parse(localStorage.getItem('user'));
                const ehContaAtual = usuarioLogado?.id === usuario.id;

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
                        <Button type="button" className="button-cancel" onClick={() => onSuspenderUsuario(usuario.id)} disabled={ehContaAtual}>
                          Suspender
                        </Button>
                      ) : (
                        <Button type="button" className="button-primary" onClick={() => onAtivarUsuario(usuario.id)}>
                          Reativar
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
