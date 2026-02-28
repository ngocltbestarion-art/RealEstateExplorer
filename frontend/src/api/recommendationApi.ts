import { apiGet } from './apiClient';
import { PropertyFeature } from '../types/property';

interface RecommendationsResponse {
  type: string;
  features: PropertyFeature[];
}

export const getSimilarProperties = async (propertyId: number): Promise<PropertyFeature[]> => {
  const response = await apiGet<RecommendationsResponse>(`/api/recommendations/similar/${propertyId}`);
  return response.features;
};
