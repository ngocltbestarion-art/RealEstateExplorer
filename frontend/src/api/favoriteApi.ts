import { apiGet, apiPost, apiDelete } from './apiClient';
import { PropertyProperties } from '../types/property';

export const getFavoriteIds = async (): Promise<number[]> => {
  return apiGet<number[]>('/api/favorites');
};

export const getFavoriteProperties = async (): Promise<PropertyProperties[]> => {
  return apiGet<PropertyProperties[]>('/api/favorites/properties');
};

export const addFavorite = async (propertyId: number): Promise<void> => {
  await apiPost(`/api/favorites/${propertyId}`, {});
};

export const removeFavorite = async (propertyId: number): Promise<void> => {
  await apiDelete(`/api/favorites/${propertyId}`);
};

export const checkFavorite = async (propertyId: number): Promise<boolean> => {
  const result = await apiGet<{ isFavorite: boolean }>(`/api/favorites/check/${propertyId}`);
  return result.isFavorite;
};
