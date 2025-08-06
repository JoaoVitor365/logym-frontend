# LOGYM - Sistema de Busca de Academias

## 📋 Sobre o Projeto

O LOGYM é um sistema web completo para busca e cadastro de academias, desenvolvido com React no frontend e Node.js no backend, utilizando MySQL como banco de dados.

## 🚀 Funcionalidades Implementadas

### Frontend (React)
- ✅ **Autenticação**: Login e cadastro de usuários
- ✅ **Busca de Academias**: Pesquisa por nome, cidade ou endereço
- ✅ **Detalhes da Academia**: Visualização completa das informações
- ✅ **Cadastro de Academia**: Formulário para adicionar novas academias (requer login)
- ✅ **Interface Responsiva**: Design adaptável para diferentes dispositivos

### Backend (Node.js + Express)
- ✅ **API RESTful**: Endpoints organizados para todas as funcionalidades
- ✅ **Autenticação JWT**: Sistema seguro de tokens
- ✅ **Criptografia**: Senhas protegidas com bcrypt
- ✅ **Validação**: Verificação de dados de entrada
- ✅ **CORS**: Configurado para comunicação frontend-backend

### Banco de Dados (MySQL)
- ✅ **Estrutura Organizada**: Tabelas users e academies
- ✅ **Relacionamentos**: Chaves estrangeiras e índices
- ✅ **Dados de Exemplo**: Academias pré-cadastradas
- ✅ **Segurança**: Senhas criptografadas

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos
- Node.js (versão 16 ou superior)
- MySQL Server
- Git

### 2. Configuração do Banco de Dados

#### Instalar MySQL (se não tiver):
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (com Homebrew)
brew install mysql

# Windows: Baixar do site oficial do MySQL
```

#### Criar o banco de dados:
```bash
# Acessar MySQL
mysql -u root -p

# Executar o script de criação (dentro do MySQL)
source /workspaces/logym-frontend/server/database/schema.sql

# Ou copiar e colar o conteúdo do arquivo schema.sql
```

### 3. Configuração do Backend

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env  # (se existir, senão usar o .env já criado)

# Editar o arquivo .env com suas configurações de banco
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha_mysql
# DB_NAME=logym_db
# DB_PORT=3306
# PORT=3001
# JWT_SECRET=logym_secret_key_2024

# Iniciar o servidor
npm run dev
```

### 4. Configuração do Frontend

```bash
# Navegar para a pasta raiz do projeto
cd ..

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## 🔧 Estrutura do Projeto

```
logym-frontend/
├── src/                          # Código fonte do frontend
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Button/             # Componente de botão
│   │   ├── Card/               # Card de academia
│   │   ├── Header/             # Cabeçalho da aplicação
│   │   ├── Input/              # Campo de entrada
│   │   └── ErrorMessage/       # Mensagem de erro
│   ├── pages/                  # Páginas da aplicação
│   │   ├── HomePage.jsx        # Página inicial com busca
│   │   ├── LoginPage.jsx       # Página de login
│   │   ├── RegisterPage.jsx    # Página de cadastro
│   │   ├── AcademyDetailsPage.jsx    # Detalhes da academia
│   │   └── AcademyRegisterPage.jsx   # Cadastro de academia
│   ├── services/               # Serviços de API
│   │   └── api.js             # Configuração do Axios
│   ├── context/               # Contextos React
│   │   └── AuthContext.jsx    # Contexto de autenticação
│   └── styles/                # Arquivos CSS organizados
├── server/                     # Código fonte do backend
│   ├── controllers/           # Controladores da API
│   ├── models/               # Modelos de dados
│   ├── routes/               # Rotas da API
│   ├── middleware/           # Middlewares
│   ├── database/             # Configuração do banco
│   └── server.js             # Servidor principal
└── public/                   # Arquivos públicos (imagens)
```

## 🔑 Principais Melhorias Implementadas

### 1. **Sistema de Autenticação Completo**
- Login e cadastro funcionais
- Tokens JWT para segurança
- Contexto global para gerenciar estado do usuário
- Proteção de rotas que requerem autenticação

### 2. **Integração Frontend-Backend**
- API RESTful completa
- Interceptors do Axios para gerenciar tokens
- Tratamento de erros padronizado
- Loading states em todas as operações

### 3. **Banco de Dados Estruturado**
- Tabelas normalizadas
- Índices para performance
- Dados de exemplo para teste
- Scripts de criação automatizados

### 4. **Código Comentado e Organizado**
- Comentários explicativos em português
- Estrutura modular e reutilizável
- Separação clara de responsabilidades
- Padrões de nomenclatura consistentes

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Fazer login

### Academias
- `GET /api/academies` - Listar todas as academias
- `GET /api/academies?q=termo` - Buscar academias
- `GET /api/academies/:id` - Detalhes de uma academia
- `POST /api/academies` - Cadastrar academia (requer autenticação)

### Saúde da API
- `GET /api/health` - Status do servidor

## 🧪 Como Testar

### 1. Testar Cadastro de Usuário
1. Acesse `http://localhost:5173/cadastrar`
2. Preencha o formulário
3. Verifique se o usuário foi criado no banco

### 2. Testar Login
1. Acesse `http://localhost:5173/login`
2. Use as credenciais criadas
3. Verifique se foi redirecionado para a home

### 3. Testar Busca de Academias
1. Na página inicial, use a barra de busca
2. Teste termos como "Smart", "Barueri", "Alphaville"

### 4. Testar Cadastro de Academia
1. Faça login primeiro
2. Acesse "Cadastrar Academia" no menu
3. Preencha o formulário
4. Verifique se a academia aparece na busca

## 🔒 Segurança Implementada

- **Senhas Criptografadas**: Usando bcrypt
- **Tokens JWT**: Para autenticação stateless
- **Validação de Entrada**: Tanto no frontend quanto backend
- **CORS Configurado**: Apenas origens permitidas
- **SQL Injection Protection**: Usando prepared statements

## 📱 Responsividade

O sistema foi desenvolvido com design responsivo, funcionando bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Upload de Imagens**: Permitir upload de fotos das academias
2. **Sistema de Avaliações**: Usuários podem avaliar academias
3. **Mapa Interativo**: Integração com Google Maps
4. **Filtros Avançados**: Por preço, modalidades, horários
5. **Notificações**: Sistema de alertas
6. **Dashboard Admin**: Painel administrativo

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql

# Reiniciar MySQL se necessário
sudo systemctl restart mysql
```

### Erro de CORS
- Verificar se o backend está rodando na porta 3001
- Confirmar configuração de CORS no server.js

### Erro de Token
- Limpar localStorage do navegador
- Fazer logout e login novamente

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console (F12 no navegador)
2. Verificar logs do servidor backend
3. Confirmar se banco de dados está acessível
4. Verificar se todas as dependências foram instaladas

---

**Desenvolvido com ❤️ para facilitar a busca por academias!**