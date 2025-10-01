// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/_profile.css'; 

function ProfilePage() {
  // Simulação de dados do usuário logado
  const [user, setUser] = useState({
    name: 'Seu Nome',
    email: 'seu.email@exemplo.com',
    phone: '(11) 98765-4321',
    password: '', // Senha é tratada separadamente, geralmente não é preenchida
  });

  const [isEditing, setIsEditing] = useState(false);

  // Função genérica para lidar com a mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  // Simula o salvamento das alterações
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // **TODO:** Aqui entrará a lógica de comunicação com o backend (POST/PUT)
    console.log("Dados atualizados:", user);

    alert('Informações atualizadas com sucesso! (Simulação)');
    setIsEditing(false); // Sai do modo de edição
  };

  return (
    <div className="profile-page-container">
      <Link to="/" className="back-button">← Voltar para Home</Link>
      
      <h1>Meu Perfil</h1>
      <p className="subtitle">Altere suas informações pessoais e de contato.</p>

      {/* Exibe o formulário de perfil */}
      <form onSubmit={handleSubmit} className="profile-form">
        
        {/* Campo Nome */}
        <label htmlFor="name">Nome Completo</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={user.name} 
          onChange={handleChange} 
          disabled={!isEditing} 
          required 
        />

        {/* Campo E-mail (Geralmente não editável, mas incluído) */}
        <label htmlFor="email">E-mail</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={user.email} 
          // Email geralmente é a chave, então mantemos como somente leitura ou desabilitado
          disabled={true} 
        />
        
        {/* Campo Telefone */}
        <label htmlFor="phone">Telefone</label>
        <input 
          type="tel" 
          id="phone" 
          name="phone" 
          value={user.phone} 
          onChange={handleChange} 
          disabled={!isEditing} 
        />

        {/* Campo Senha (Deixado em branco para UX) */}
        {isEditing && (
          <>
            <label htmlFor="password">Nova Senha</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={user.password} 
              onChange={handleChange} 
              placeholder="Deixe em branco para não alterar"
            />
          </>
        )}
        
        {/* Botões de Ação */}
        <div className="button-group">
          {isEditing ? (
            <>
              <button type="submit" className="save-button">Salvar Alterações</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancelar</button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="edit-button">Editar Informações</button>
          )}
        </div>
      </form>

    </div>
  );
}

export default ProfilePage;