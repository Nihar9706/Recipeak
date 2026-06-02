import api from './api';
import type { User, ApiResponse } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      name,
      email,
      password,
    });
    return res.data.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    return res.data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data.user;
  },
};
