# 🚀 LOGYM - Início Rápido

## ⚡ Execução em 5 Passos

### 1. **Configurar MySQL**
```bash
# Instalar MySQL (se necessário)
sudo apt install mysql-server  # Ubuntu/Debian
# ou
brew install mysql  # macOS

# Iniciar MySQL
sudo systemctl start mysql
```

### 2. **Configurar Backend**
```bash
cd server
npm install
npm run init-db  # Criar banco e tabelas
npm run dev      # Iniciar servidor (porta 3001)
```

### 3. **Configurar Frontend**
```bash
cd ..  # Voltar para pasta raiz
npm install
npm run dev  # Iniciar frontend (porta 5173)
```

### 4. **Acessar Sistema**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### 5. **Testar Funcionalidades**
1. Cadastrar usuário em `/cadastrar`
2. Fazer login em `/login`
3. Buscar academias na home
4. Cadastrar nova academia (logado)

## 🔧 Configuração Rápida do MySQL

Se o MySQL pedir senha durante a instalação:

```bash
# Configurar senha do root
sudo mysql_secure_installation

# Ou acessar sem senha (desenvolvimento)
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

## 📁 Estrutura de Arquivos Importantes

```
logym-frontend/
├── server/
│   ├── .env                 # Configurações do banco
│   ├── server.js           # Servidor principal
│   └── database/schema.sql # Script do banco
├── src/
│   ├── pages/              # Páginas React
│   ├── services/api.js     # Configuração da API
│   └── context/AuthContext.jsx # Autenticação
└── package.json            # Dependências frontend
```

## 🎯 URLs Principais

- **Home**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Cadastro**: http://localhost:5173/cadastrar
- **Cadastrar Academia**: http://localhost:5173/cadastrar-academia
- **API Health**: http://localhost:3001/api/health

## 🔍 Verificação Rápida

### Backend funcionando:
```bash
curl http://localhost:3001/api/health
# Deve retornar: {"success":true,"message":"Servidor LOGYM funcionando!"}
```

### Banco criado:
```bash
mysql -u root -p -e "USE logym_db; SHOW TABLES;"
# Deve mostrar: academies, users
```

### Frontend funcionando:
- Abrir http://localhost:5173
- Deve carregar página com academias

## ⚠️ Problemas Comuns

| Problema | Solução |
|----------|---------|
| MySQL não conecta | Verificar se está rodando: `sudo systemctl status mysql` |
| Porta 3001 ocupada | Matar processo: `sudo lsof -ti:3001 \| xargs kill -9` |
| CORS error | Verificar se backend está na porta 3001 |
| Academias não carregam | Verificar console do navegador (F12) |

## 📞 Suporte Rápido

1. **Logs do Backend**: Verificar terminal onde rodou `npm run dev`
2. **Logs do Frontend**: Abrir DevTools (F12) → Console
3. **Banco de Dados**: `mysql -u root -p` → `USE logym_db;`

---

**🎉 Sistema pronto! Agora você pode buscar e cadastrar academias!**