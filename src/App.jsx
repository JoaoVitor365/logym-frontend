import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';

import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AcademyDetailsPage from './pages/Academy/AcademyDetailsPage';
import AcademyRegisterPage from './pages/Academy/AcademyRegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CompleteManagerProfile from './pages/Manager/CompleteManagerProfile';
import ManagerPanelPage from './pages/Manager/ManagerPanelPage';
import AcademyEditPage from './pages/Academy/AcademyEditPage';
import FavoritesPage from './pages/Academy/FavoritesPage';
import AdminPanelPage from './pages/Admin/AdminPanelPage';

import Header from './components/Header/Header';
import UsuarioService from './services/UsuarioService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Controla se o Web ainda está sincronizando o usuário com o banco.
  // Isso evita mostrar nome/CEP antigos do localStorage.
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  useEffect(() => {
    async function carregarUsuarioAtualizado() {
      const userData = localStorage.getItem('user');

      // Se não tiver usuário salvo, não precisa buscar nada.
      if (!userData) {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCarregandoUsuario(false);
        return;
      }

      const userLocal = JSON.parse(userData);

      try {
        // Busca o usuário atualizado direto do banco.
        // Assim alterações feitas no Mobile aparecem no Web logo no primeiro reload.
        const response = await UsuarioService.findById(userLocal.id);
        const usuarioBanco = response.data;

        // Junta dados locais com dados atualizados do banco.
        // O banco tem prioridade para nome, CEP, status etc.
        const usuarioAtualizado = {
          ...userLocal,
          ...usuarioBanco,
          id: usuarioBanco.id || userLocal.id,
          nome: usuarioBanco.nome || userLocal.nome,
          username: usuarioBanco.username || userLocal.username,
          cep: usuarioBanco.cep || userLocal.cep || '',
          nivelAcesso: usuarioBanco.nivelAcesso || userLocal.nivelAcesso,
          statusUsuario: usuarioBanco.statusUsuario || userLocal.statusUsuario,
        };

        // Atualiza primeiro o localStorage.
        localStorage.setItem('user', JSON.stringify(usuarioAtualizado));

        // Depois atualiza o estado usado pelo Header e pelas páginas.
        setCurrentUser(usuarioAtualizado);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao buscar usuário atualizado:', error);

        // Se der erro, usa o usuário local para não deslogar por falha temporária.
        setCurrentUser(userLocal);
        setIsLoggedIn(true);
      } finally {
        setCarregandoUsuario(false);
      }
    }

    carregarUsuarioAtualizado();
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('gerente');

    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Enquanto busca o usuário atualizado no banco,
  // segura a renderização para não mostrar dados antigos.
  if (carregandoUsuario) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        Carregando LOGYM...
      </div>
    );
  }

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} />} />

          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />

          <Route path="/cadastrar" element={<RegisterPage />} />
          <Route path="/academia/:id" element={<AcademyDetailsPage />} />
          <Route path="/cadastrar-academia" element={<AcademyRegisterPage />} />
          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />

          <Route
            path="/profile"
            element={<ProfilePage currentUser={currentUser} />}
          />

          <Route
            path="/completar-cadastro-gerente"
            element={<CompleteManagerProfile />}
          />

          <Route path="/painel-gerente" element={<ManagerPanelPage />} />

          <Route
            path="/painel-admin"
            element={<AdminPanelPage currentUser={currentUser} />}
          />

          <Route path="/editar-academia/:id" element={<AcademyEditPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;