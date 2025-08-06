// src/App.jsx - Aplicação principal com contexto de autenticação
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';

// Importações dos componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AcademyDetailsPage from './pages/AcademyDetailsPage';
import AcademyRegisterPage from './pages/AcademyRegisterPage';

function App() {
  return (
    // Envolver toda a aplicação com o AuthProvider para gerenciar autenticação
    <AuthProvider>
      <div className="App">
        <Header /> {/* Cabeçalho exibido em todas as páginas */}

        <main> {/* Conteúdo principal da aplicação */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastrar" element={<RegisterPage />} />
            <Route path="/academia/:id" element={<AcademyDetailsPage />} />
            <Route path="/cadastrar-academia" element={<AcademyRegisterPage />} />
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<h1>Página Não Encontrada</h1>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;