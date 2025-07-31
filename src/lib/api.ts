// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete`,
  CHANGE_EMAIL: `${API_BASE_URL}/api/auth/change-email`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
  
  // Chat endpoints
  CHAT: `${API_BASE_URL}/api/chat`,
  CHAT_ALL: `${API_BASE_URL}/api/chat/all`,
  
  // Streak endpoints
  STREAK: `${API_BASE_URL}/api/streak`,
  STREAK_ALL: `${API_BASE_URL}/api/streak/all`,
};

export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export default API_ENDPOINTS; 