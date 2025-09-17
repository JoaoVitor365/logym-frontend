const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:8080/api'

// Mock API para desenvolvimento offline
export const mockAPI = {
  auth: {
    login: (data) => Promise.resolve({ data: 'Login realizado com sucesso!' }),
    register: (data) => Promise.resolve({ data: 'Usuário cadastrado com sucesso!' })
  },
  academies: {
    getAll: () => Promise.resolve({
      data: [
        {
          id: 1,
          name: 'Smart Fit',
          address: 'Rua das Flores, 123 - Centro',
          rating: 4.5,
          image: '/images/smartFit.jpeg'
        },
        {
          id: 2,
          name: 'Bio Ritmo',
          address: 'Av. Principal, 456 - Jardins',
          rating: 4.8,
          image: '/images/bioRitmo.jpeg'
        },
        {
          id: 3,
          name: 'Blue Fit',
          address: 'Rua do Comércio, 789 - Vila Nova',
          rating: 4.2,
          image: '/images/blueFit.jpeg'
        },
        {
          id: 4,
          name: 'Gaviões da Fiel',
          address: 'Rua Corinthiana, 100 - Itaquera',
          rating: 4.6,
          image: '/images/gavioes.jpeg'
        }
      ]
    })
  }
}

export default API_BASE_URL