// Script para inicializar o banco de dados automaticamente
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração da conexão (sem especificar database inicialmente)
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true // Permitir múltiplas queries
};

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(connectionConfig);
    
    console.log('✅ Conectado ao MySQL com sucesso!');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../database/schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 Executando script de criação do banco...');
    
    // Executar o script SQL
    await connection.execute(sqlContent);
    
    console.log('✅ Banco de dados criado com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('   - users (usuários)');
    console.log('   - academies (academias)');
    console.log('🎯 Dados de exemplo inseridos!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔑 Erro de acesso: Verifique usuário e senha do MySQL');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Erro de conexão: Verifique se o MySQL está rodando');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar inicialização
console.log('🚀 Iniciando configuração do banco de dados LOGYM...');
initializeDatabase();