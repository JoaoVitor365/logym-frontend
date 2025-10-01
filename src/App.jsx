// src/App.jsx
import React, { useState } from 'react'; // 👈 1. IMPORTAMOS O useState
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';

// Importações dos componentes de página
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AcademyDetailsPage from './pages/AcademyDetailsPage';
import AcademyRegisterPage from './pages/AcademyRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';

import Header from './components/Header/Header'; 

function App() {
  
  // 2. ESTADO CENTRAL DE AUTENTICAÇÃO
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Começa como deslogado

  // 3. FUNÇÃO DE LOGIN (Simulação)
  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log('Login bem-sucedido! O estado do App mudou para true.');
  };

  // 4. FUNÇÃO DE LOGOUT (Simulação)
  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log('Logout realizado. O estado do App mudou para false.');
  };

  return (
    <div className="App">
      
      {/* 5. PASSAMOS O ESTADO E O HANDLER DE LOGOUT PARA O HEADER */}
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      /> 

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* 6. PASSAMOS O HANDLER DE LOGIN PARA A PÁGINA DE LOGIN */}
          <Route 
            path="/login" 
            element={<LoginPage onLogin={handleLogin} />} 
          />
          
          <Route path="/cadastrar" element={<RegisterPage />} />
          <Route path="/academia/:id" element={<AcademyDetailsPage />} />
          <Route path="/cadastrar-academia" element={<AcademyRegisterPage />} />
          <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;