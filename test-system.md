# 🧪 Guia de Teste do Sistema LOGYM

## ✅ Checklist de Funcionalidades

### 1. **Configuração Inicial**
- [ ] MySQL instalado e rodando
- [ ] Banco de dados criado (`npm run init-db` na pasta server)
- [ ] Backend rodando (`npm run dev` na pasta server)
- [ ] Frontend rodando (`npm run dev` na pasta raiz)

### 2. **Teste de Cadastro de Usuário**
1. Acesse: `http://localhost:5173/cadastrar`
2. Preencha o formulário:
   - Nome: "João Silva"
   - Email: "joao@teste.com"
   - Senha: "123456"
   - Confirmar Senha: "123456"
3. Clique em "Cadastrar"
4. ✅ **Esperado**: Redirecionamento para home com usuário logado

### 3. **Teste de Login**
1. Acesse: `http://localhost:5173/login`
2. Use as credenciais criadas no teste anterior
3. Clique em "Entrar"
4. ✅ **Esperado**: Redirecionamento para home, nome do usuário no header

### 4. **Teste de Busca de Academias**
1. Na página inicial, teste os seguintes termos:
   - "Smart" → Deve encontrar Smart Fit
   - "Barueri" → Deve encontrar todas as academias
   - "Alphaville" → Deve encontrar Gaviões
   - "XYZ" → Deve mostrar "Nenhuma academia encontrada"
2. ✅ **Esperado**: Resultados corretos para cada busca

### 5. **Teste de Detalhes da Academia**
1. Clique em "Ver Detalhes" em qualquer academia
2. ✅ **Esperado**: Página com informações completas da academia

### 6. **Teste de Cadastro de Academia (Usuário Logado)**
1. Faça login primeiro
2. Clique em "Cadastrar Academia" no menu
3. Preencha o formulário:
   - Nome: "Academia Teste"
   - Endereço: "Rua Teste, 123"
   - Cidade: "São Paulo"
   - Estado: "SP"
   - Descrição: "Academia para testes"
4. Clique em "Cadastrar Academia"
5. ✅ **Esperado**: Redirecionamento para home, nova academia aparece na busca

### 7. **Teste de Proteção de Rotas**
1. Faça logout
2. Tente acessar: `http://localhost:5173/cadastrar-academia`
3. ✅ **Esperado**: Redirecionamento automático para login

### 8. **Teste de Responsividade**
1. Redimensione a janela do navegador
2. Teste em diferentes tamanhos:
   - Desktop (1200px+)
   - Tablet (768px-1199px)
   - Mobile (até 767px)
3. ✅ **Esperado**: Layout se adapta corretamente

## 🔍 Verificações no Banco de Dados

### Verificar Usuários Criados:
```sql
USE logym_db;
SELECT id, name, email, created_at FROM users;
```

### Verificar Academias:
```sql
SELECT id, name, city, rating FROM academies;
```

### Verificar Senhas Criptografadas:
```sql
SELECT email, password FROM users LIMIT 1;
-- A senha deve estar criptografada (hash bcrypt)
```

## 🐛 Problemas Comuns e Soluções

### ❌ Erro: "Cannot connect to database"
**Solução:**
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql
# Se não estiver, iniciar
sudo systemctl start mysql
```

### ❌ Erro: "Access denied for user"
**Solução:**
1. Verificar credenciais no arquivo `.env`
2. Testar conexão manual: `mysql -u root -p`

### ❌ Erro: "CORS policy"
**Solução:**
1. Verificar se backend está rodando na porta 3001
2. Verificar configuração de CORS no `server.js`

### ❌ Frontend não carrega academias
**Solução:**
1. Abrir DevTools (F12)
2. Verificar erros no Console
3. Verificar se API está respondendo: `http://localhost:3001/api/health`

### ❌ Token expirado
**Solução:**
1. Limpar localStorage: `localStorage.clear()`
2. Fazer logout e login novamente

## 📊 Endpoints para Teste Manual

### Testar API diretamente:

**Saúde da API:**
```bash
curl http://localhost:3001/api/health
```

**Listar Academias:**
```bash
curl http://localhost:3001/api/academies
```

**Buscar Academia:**
```bash
curl "http://localhost:3001/api/academies?q=Smart"
```

**Registrar Usuário:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'
```

## 🎯 Critérios de Sucesso

### ✅ Sistema está funcionando se:
1. Usuários podem se cadastrar e fazer login
2. Busca de academias retorna resultados corretos
3. Detalhes das academias são exibidos
4. Usuários logados podem cadastrar academias
5. Interface é responsiva
6. Dados são persistidos no banco
7. Autenticação funciona corretamente
8. Não há erros no console

### 📈 Métricas de Performance:
- Tempo de carregamento da página inicial: < 2s
- Tempo de resposta da API: < 500ms
- Busca de academias: < 1s

## 🚀 Próximos Passos Após Testes

Se todos os testes passaram:
1. ✅ Sistema está pronto para uso
2. 📝 Documentar quaisquer bugs encontrados
3. 🔧 Implementar melhorias identificadas
4. 🎨 Ajustar design se necessário
5. 🔒 Revisar segurança
6. 📱 Testar em dispositivos reais

---

**🎉 Parabéns! Se todos os testes passaram, o sistema LOGYM está funcionando perfeitamente!**