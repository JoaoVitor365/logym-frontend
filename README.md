# Logym - Sistema de Academias

Projeto full-stack com backend Spring Boot e frontend React.

## 🔧 Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- Java 17+
- Maven 3.6+

## 🚀 Tecnologias

### Frontend
- React 19
- Vite 7
- Bootstrap 5
- React Router DOM 7
- Axios 1.11
- React Bootstrap 2.10

### Backend
- Spring Boot 3.2
- Spring Data JPA
- Spring Security
- SQL Server (Microsoft)
- Maven
- BCrypt (criptografia)

## ⚙️ Como executar

### Backend
```bash
cd backend
mvn spring-boot:run
```
Backend disponível em: http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend disponível em: http://localhost:5173

## 📡 Endpoints da API

### Autenticação
- POST `/api/auth/register` - Registrar usuário
- POST `/api/auth/login` - Login

### Academias
- GET `/api/academies` - Listar academias
- GET `/api/academies/{id}` - Buscar academia por ID
- POST `/api/academies` - Criar academia

## 🗄️ Banco de Dados
- Servidor: LOGYM01.mssql.somee.com
- Banco: LOGYM01
- Usuário: LOGYM
- Senha: @ITB123456

## 🚀 Deploy

### Desenvolvimento Local
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- API: http://localhost:8080/api

### Produção
- Backend: Configurado para Somee.com
- Frontend: Pronto para deploy em qualquer provedor

## 📁 Estrutura do Projeto

```
logym-frontend/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/logym/
│   │   ├── controller/      # Controllers REST
│   │   ├── service/         # Lógica de negócio
│   │   ├── repository/      # Acesso a dados
│   │   ├── model/           # Entidades JPA
│   │   ├── dto/             # Data Transfer Objects
│   │   └── config/          # Configurações
│   └── pom.xml              # Dependências Maven
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── config/          # Configurações
│   │   └── styles/          # Estilos CSS
│   └── package.json         # Dependências NPM
└── README.md                # Documentação
```

## 🎯 Funcionalidades

- ✅ Sistema de autenticação (Login/Registro)
- ✅ Listagem de academias
- ✅ Interface responsiva com Bootstrap
- ✅ API REST com Spring Boot
- ✅ Banco de dados SQL Server
- ✅ Criptografia de senhas com BCrypt
- ✅ Configuração para múltiplos ambientes