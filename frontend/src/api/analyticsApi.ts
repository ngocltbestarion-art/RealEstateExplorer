import { apiGet } from './apiClient';

export interface AnalyticsOverview {
  totalProperties: number;
  averagePrice: number;
  maxPrice: number;
  minPrice: number;
  availableCount: number;
  soldCount: number;
  pendingCount: number;
}

export interface PropertyTypeDistribution {
  typeName: string;
  count: number;
  percentage: number;
}

export interface PriceTrend {
  period: string;
  averagePrice: number;
  count: number;
}

export interface GeographicDistribution {
  region: string;
  count: number;
  averagePrice: number;
}

export const getAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  return apiGet<AnalyticsOverview>('/api/analytics/overview');
};

export const getTypeDistribution = async (): Promise<PropertyTypeDistribution[]> => {
  return apiGet<PropertyTypeDistribution[]>('/api/analytics/distribution-by-type');
};

export const getPriceTrends = async (): Promise<PriceTrend[]> => {
  return apiGet<PriceTrend[]>('/api/analytics/price-trends');
};

export const getGeographicDistribution = async (): Promise<GeographicDistribution[]> => {
  return apiGet<GeographicDistribution[]>('/api/analytics/geographic-distribution');
};
