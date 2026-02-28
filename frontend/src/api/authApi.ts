import { apiGet, apiPost } from './apiClient';
import { AuthResponse, User } from '../types/property';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  return apiPost<AuthResponse>('/api/auth/login', {
    username,
    password
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiGet<User>('/api/auth/me');
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
