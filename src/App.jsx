// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';

// Importações dos componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AcademyDetailsPage from './pages/AcademyDetailsPage';
import AcademyRegisterPage from './pages/AcademyRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import Header from './components/Header/Header'; // <-- Nova importação do Header

function App() {
  return (
    <div className="App">
      <Header /> {/* <-- O cabeçalho será exibido em todas as páginas */}

      <main> {/* Uma tag <main> para o conteúdo principal */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastrar" element={<RegisterPage />} />
          <Route path="/academia/:id" element={<AcademyDetailsPage />} />
          <Route path="/cadastrar-academia" element={<AcademyRegisterPage />} />
          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
          {/* <Route path="*" element={<h1>Página Não Encontrada</h1>} /> */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;