import React, { useState, useEffect } from 'react';
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      
      <Header 
        isLoggedIn={isLoggedIn} 
        currentUser={currentUser}
        onLogout={handleLogout} 
      /> 

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
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