export interface PropertyFeature {
  type: 'Feature';
  properties: PropertyProperties;
  geometry: GeoJSON.Geometry;
}

export interface PropertyProperties {
  id: number;
  name: string;
  price: number;
  area_sqft: number;
  address: string;
  description: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  year_built?: number;
  direction?: string;
  legal_status?: string;
  views?: number;
  featured?: boolean;
  property_type?: string;
  property_type_id?: number;
  images?: string[];
  primary_image?: string;
}

export interface PropertyType {
  id: number;
  name: string;
  description: string;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  propertyTypeId?: number;
  status?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export interface PropertyPage {
  content: PropertyProperties[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}
