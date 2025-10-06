# Conexão Frontend-Backend - LOGYM

## Configuração Realizada

### 1. Serviço de API (`src/services/api.js`)
- Centraliza todas as chamadas para o backend
- Métodos implementados:
  - `registerUser()` - Cadastro de usuário
  - `loginUser()` - Login (busca usuário por email/senha)
  - `getUserById()` - Buscar usuário por ID
  - `updateUser()` - Atualizar dados do usuário

### 2. Páginas Atualizadas

#### LoginPage
- Conecta com backend para autenticação
- Salva dados do usuário no localStorage
- Gerencia estado de loading e mensagens de erro

#### RegisterPage
- Usa ApiService para cadastro
- Validação de dados mantida
- Redirecionamento automático após sucesso

#### ProfilePage
- Carrega dados do usuário do localStorage
- Permite edição de nome e senha
- Atualiza dados no backend via API

### 3. Gerenciamento de Estado
- App.jsx gerencia estado global de autenticação
- Persistência de dados via localStorage
- Header atualizado dinamicamente baseado no login

## Como Executar

### Backend (Spring Boot)
1. Navegue até a pasta do backend:
   ```
   cd c:\Users\jpfer\OneDrive\TCC\logym-backend-main
   ```

2. Execute o projeto:
   ```
   ./mvnw spring-boot:run
   ```
   ou
   ```
   mvnw.cmd spring-boot:run
   ```

3. O backend estará disponível em: `http://localhost:8080`

### Frontend (React + Vite)
1. Navegue até a pasta do frontend:
   ```
   cd c:\Users\jpfer\OneDrive\TCC\logym-frontend
   ```

2. Instale as dependências (se necessário):
   ```
   npm install
   ```

3. Execute o projeto:
   ```
   npm run dev
   ```

4. O frontend estará disponível em: `http://localhost:5173`

## Funcionalidades Implementadas

✅ **Cadastro de Usuário**
- Formulário conectado ao endpoint POST `/api/v1/usuario`
- Validação de dados no frontend
- Mensagens de sucesso/erro

✅ **Login de Usuário**
- Autenticação via busca por email/senha
- Persistência de sessão via localStorage
- Redirecionamento após login

✅ **Perfil do Usuário**
- Carregamento de dados do usuário logado
- Edição de nome e senha
- Atualização via endpoint PUT `/api/v1/usuario/{id}`

✅ **Gerenciamento de Estado**
- Estado global de autenticação
- Header dinâmico (Login/Logout)
- Persistência entre sessões

## Estrutura de Arquivos Criados/Modificados

```
src/
├── config/
│   └── api.js              # Configurações da API
├── services/
│   └── api.js              # Serviço centralizado de API
├── pages/
│   ├── LoginPage.jsx       # ✏️ Modificado
│   ├── RegisterPage.jsx    # ✏️ Modificado
│   └── ProfilePage.jsx     # ✏️ Modificado
└── App.jsx                 # ✏️ Modificado
```

## Próximos Passos (Opcionais)

- Implementar criptografia de senhas no backend
- Adicionar sistema de tokens JWT
- Implementar validação de sessão expirada
- Adicionar loading states mais elaborados
- Implementar tratamento de erros mais específicos