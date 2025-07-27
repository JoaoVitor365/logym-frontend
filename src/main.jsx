// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css'; // Mantenha o caminho correto para o seu CSS
import { BrowserRouter } from 'react-router-dom'; // <-- Nova importação

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvendo o App com BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);