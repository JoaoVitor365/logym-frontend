// src/pages/Admin/AdminSidebar.jsx
import React from 'react';

function AdminSidebar({ activeSection, menuItems, currentUser, onMudarSecao }) {
  const usuarioSalvo = JSON.parse(localStorage.getItem('user'));

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__logo">LOGYM</h2>
        <span className="admin-sidebar__subtitle">Painel Admin</span>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => {
          const ativo = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onMudarSecao(item.id)}
              onMouseDown={(event) => event.preventDefault()}
              className={`admin-sidebar__button ${ativo ? 'admin-sidebar__button--active' : ''}`}
            >
              <span className="admin-sidebar__button-label">{item.label}</span>
              <small className="admin-sidebar__button-description">{item.description}</small>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <p className="admin-sidebar__footer-label">Administrador</p>
        <strong className="admin-sidebar__footer-name">
          {currentUser?.nome || usuarioSalvo?.nome || 'ADMIN'}
        </strong>
      </div>
    </aside>
  );
}

export default AdminSidebar;
