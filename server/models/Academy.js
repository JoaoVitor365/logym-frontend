// Model para operações com academias no banco de dados
import pool from '../database/connection.js';

class Academy {
  // Buscar todas as academias
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM academies ORDER BY rating DESC'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar academia por ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM academies WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar academias por nome ou cidade
  static async search(searchTerm) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await pool.execute(
        'SELECT * FROM academies WHERE name LIKE ? OR city LIKE ? OR address LIKE ? ORDER BY rating DESC',
        [searchPattern, searchPattern, searchPattern]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Criar nova academia
  static async create(academyData) {
    const { name, address, city, state, rating, image_url, description, phone, email } = academyData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO academies (name, address, city, state, rating, image_url, description, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, rating || 0, image_url, description, phone, email]
      );
      
      return { id: result.insertId, ...academyData };
    } catch (error) {
      throw error;
    }
  }
}

export default Academy;