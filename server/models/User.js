// Model para operações com usuários no banco de dados
import pool from '../database/connection.js';
import bcrypt from 'bcryptjs';

class User {
  // Criar novo usuário
  static async create(userData) {
    const { name, email, password } = userData;
    
    try {
      // Criptografar senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      
      return { id: result.insertId, name, email };
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar usuário por email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Verificar senha
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Buscar usuário por ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [id]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

export default User;