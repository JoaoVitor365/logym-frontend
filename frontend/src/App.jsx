import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AcademyRegisterPage from './pages/AcademyRegisterPage'
import AcademyDetailsPage from './pages/AcademyDetailsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UserProfilePage from './pages/UserProfilePage'
import AcademyProfilePage from './pages/AcademyProfilePage'
import './styles/global.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastrar" element={<RegisterPage />} />
        <Route path="/cadastrar-academia" element={<AcademyRegisterPage />} />
        <Route path="/academia/:id" element={<AcademyDetailsPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/perfil" element={<UserProfilePage />} />
        <Route path="/perfil-academia" element={<AcademyProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App