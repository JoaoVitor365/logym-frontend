import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import '../styles/pages/_profile.css'; 

function ProfilePage() {
  const [user, setUser] = useState({
    id: '',
    nome: '',
    email: '',
    senha: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const academiaData = localStorage.getItem('academia');
    
    console.log('Dados do localStorage - user:', userData);
    console.log('Dados do localStorage - academia:', academiaData);
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Usuário parseado:', parsedUser);
      setUser({
        id: parsedUser.id,
        nome: parsedUser.nome,
        email: parsedUser.email,
        senha: '',
        tipo: 'usuario'
      });
    } else if (academiaData) {
      const parsedAcademia = JSON.parse(academiaData);
      console.log('Academia parseada:', parsedAcademia);
      setUser({
        id: parsedAcademia.id,
        nome: parsedAcademia.nome,
        email: parsedAcademia.email,
        senha: '',
        tipo: 'academia'
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Campo alterado:', name, 'Novo valor:', value);
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage('');
    setLoading(true);
    
    console.log('Dados do usuário antes da atualização:', user);
    
    try {
      const updateData = {
        nome: user.nome,
        email: user.email,
        statusUsuario: true
      };

      if (user.senha && user.senha.trim() !== '') {
        updateData.senha = user.senha;
      }

      console.log('Dados enviados para API:', updateData);
      console.log('ID do usuário:', user.id);
      
      let updatedUser;
      
      if (user.tipo === 'academia') {
        updatedUser = await ApiService.updateAcademia(user.id, updateData);
        localStorage.setItem('academia', JSON.stringify(updatedUser));
      } else {
        updatedUser = await ApiService.updateUser(user.id, updateData);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      console.log('Resposta da API:', updatedUser);
      setUser(prev => ({ ...prev, senha: '' }));
      setApiMessage('Informações atualizadas com sucesso!');
      setIsEditing(false);
      
    } catch (error) {
      console.error('Erro na atualização:', error);
      setApiMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateAccount = async () => {
    setApiMessage('');
    setLoading(true);
    
    try {
      const updateData = {
        nome: user.nome,
        email: user.email,
        statusUsuario: false
      };

      await ApiService.updateUser(user.id, updateData);
      
      localStorage.removeItem('user');
      setApiMessage('Conta inativada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      setApiMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
      setShowInactivateConfirm(false);
    }
  };

  return (
    <div className="profile-page-container">
      <Link to="/" className="back-button">← Voltar para Home</Link>
      
      <h1>Meu Perfil</h1>
      <p className="subtitle">Altere suas informações pessoais e de contato.</p>

      {apiMessage && (
        <p className={apiMessage.startsWith('Erro') ? 'error-message' : 'success-message'} style={{
          padding: '10px', 
          borderRadius: '5px',
          backgroundColor: apiMessage.startsWith('Erro') ? '#f8d7da' : '#d4edda', 
          color: apiMessage.startsWith('Erro') ? '#721c24' : '#155724',
          marginBottom: '15px'
        }}>
          {apiMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        
        <label htmlFor="nome">{user.tipo === 'academia' ? 'Nome da Academia' : 'Nome Completo'}</label>
        <input 
          type="text" 
          id="nome" 
          name="nome" 
          value={user.nome || ''} 
          onChange={handleChange} 
          disabled={!isEditing} 
          required 
        />

        <label htmlFor="email">E-mail</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={user.email || ''} 
          onChange={handleChange}
          disabled={!isEditing} 
        />

        {isEditing && (
          <>
            <label htmlFor="senha">Nova Senha</label>
            <input 
              type="password" 
              id="senha" 
              name="senha" 
              value={user.senha || ''} 
              onChange={handleChange} 
              placeholder="Deixe em branco para não alterar"
            />
          </>
        )}
        
        <div className="button-group">
          {isEditing ? (
            <>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button type="button" onClick={(e) => {e.preventDefault(); setIsEditing(false);}} className="cancel-button">
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={(e) => {e.preventDefault(); console.log('Modo de edição ativado'); setIsEditing(true);}} className="edit-button">
                Editar Informações
              </button>
              <button type="button" onClick={(e) => {e.preventDefault(); setShowInactivateConfirm(true);}} className="cancel-button" style={{marginTop: '10px'}}>
                Inativar Conta
              </button>
            </>
          )}
        </div>

        {showInactivateConfirm && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <h3>Confirmar Inativação</h3>
              <p>Tem certeza que deseja inativar sua conta? Esta ação pode ser revertida posteriormente.</p>
              <div style={{marginTop: '20px'}}>
                <button 
                  onClick={handleInactivateAccount} 
                  disabled={loading}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Inativando...' : 'Sim, Inativar'}
                </button>
                <button 
                  onClick={() => setShowInactivateConfirm(false)}
                  style={{
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

    </div>
  );
}

export default ProfilePage;