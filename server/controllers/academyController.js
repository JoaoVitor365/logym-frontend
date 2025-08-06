// Controller para operações com academias
import Academy from '../models/Academy.js';

// Buscar todas as academias
export const getAllAcademies = async (req, res) => {
  try {
    const academies = await Academy.findAll();
    res.json({
      success: true,
      data: academies
    });
  } catch (error) {
    console.error('Erro ao buscar academias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
};

// Buscar academia por ID
export const getAcademyById = async (req, res) => {
  try {
    const { id } = req.params;
    const academy = await Academy.findById(id);
    
    if (!academy) {
      return res.status(404).json({ 
        success: false, 
        message: 'Academia não encontrada' 
      });
    }
    
    res.json({
      success: true,
      data: academy
    });
  } catch (error) {
    console.error('Erro ao buscar academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
};

// Buscar academias (com filtro de pesquisa)
export const searchAcademies = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return getAllAcademies(req, res);
    }
    
    const academies = await Academy.search(q);
    res.json({
      success: true,
      data: academies
    });
  } catch (error) {
    console.error('Erro na busca de academias:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
};

// Criar nova academia
export const createAcademy = async (req, res) => {
  try {
    const academyData = req.body;
    const newAcademy = await Academy.create(academyData);
    
    res.status(201).json({
      success: true,
      message: 'Academia criada com sucesso',
      data: newAcademy
    });
  } catch (error) {
    console.error('Erro ao criar academia:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
};