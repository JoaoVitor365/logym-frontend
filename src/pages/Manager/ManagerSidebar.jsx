import React from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'Visão geral da sua conta' },
  { id: 'academias', label: 'Minhas Academias', description: 'Gerencie suas academias' }
];

function ManagerSidebar({ activeSection, managerName, onSectionChange }) {
  return (
    <aside className="manager-sidebar">
      <div className="manager-sidebar__header">
        <h2 className="manager-sidebar__logo">LOGYM</h2>
        <span className="manager-sidebar__subtitle">Painel do Gerente</span>
      </div>

      <nav className="manager-sidebar__nav" aria-label="Navegação do painel do gerente">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`manager-sidebar__button ${activeSection === item.id ? 'manager-sidebar__button--active' : ''}`}
          >
            <span className="manager-sidebar__button-label">{item.label}</span>
            <small className="manager-sidebar__button-description">{item.description}</small>
          </button>
        ))}
      </nav>

      <div className="manager-sidebar__footer">
        <span className="manager-sidebar__footer-avatar" aria-hidden="true">{managerName.charAt(0).toUpperCase()}</span>
        <div>
          <strong className="manager-sidebar__footer-name">{managerName}</strong>
          <p className="manager-sidebar__footer-label">Gerente</p>
        </div>
      </div>
    </aside>
  );
}

export default ManagerSidebar;
