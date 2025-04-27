import axios from 'axios';

// Base URL da API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para lidar com erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Verificar se o erro é devido a um token expirado (401)
    if (error.response?.status === 401) {
      // Limpar o token e redirecionar para o login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
