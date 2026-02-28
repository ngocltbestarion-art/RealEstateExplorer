import { apiGet, apiPost } from './apiClient';
import { PropertyFeature, PropertyFilter, PropertyPage, PropertyType } from '../types/property';

interface PropertyFeatureCollection {
  type: 'FeatureCollection';
  features: PropertyFeature[];
}

export async function getProperties() {
  const data = await apiGet<PropertyFeatureCollection>('/api/properties');
  return data.features;
}

export async function getPropertyById(id: number) {
  return apiGet<any>(`/api/properties/${id}`);
}

export async function getFeaturedProperties() {
  const data = await apiGet<PropertyFeatureCollection>('/api/properties/featured');
  return data.features;
}

export async function filterProperties(filter: PropertyFilter) {
  return apiPost<PropertyPage>('/api/properties/filter', filter);
}

export async function getPropertiesWithinGeometry(geometry: GeoJSON.Feature) {
  const data = await apiPost<PropertyFeatureCollection>('/api/properties/within', {
    geometry: geometry.geometry
  });
  return data.features;
}

export async function searchProperties(query: string) {
  const data = await apiGet<PropertyFeatureCollection>(`/api/properties/search?q=${encodeURIComponent(query)}`);
  return data.features;
}

export async function getPropertyTypes() {
  return apiGet<PropertyType[]>('/api/property-types');
}
