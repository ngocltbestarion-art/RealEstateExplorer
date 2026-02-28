import React from 'react';
import { PropertyFeature } from '../../types/property';
import { useFavorites } from '../../contexts/FavoriteContext';

interface PropertyListProps {
  properties: PropertyFeature[];
  onPropertyClick: (property: PropertyFeature) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onPropertyClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>
        Properties ({properties.length})
      </h3>
      
      {properties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
          No properties found
        </div>
      )}

      {properties.map((property) => (
        <div
          key={property.properties.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            backgroundColor: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          onClick={() => onPropertyClick(property)}
        >
          {property.properties.primary_image && (
            <img
              src={property.properties.primary_image}
              alt={property.properties.name}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover'
              }}
            />
          )}
          
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                {property.properties.name}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.properties.id);
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0 4px'
                }}
              >
                {isFavorite(property.properties.id) ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px' }}>
              {formatPrice(property.properties.price)}
            </div>
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              📍 {property.properties.address}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666' }}>
              {property.properties.bedrooms && (
                <span>🛏️ {property.properties.bedrooms} beds</span>
              )}
              {property.properties.bathrooms && (
                <span>🚿 {property.properties.bathrooms} baths</span>
              )}
              {property.properties.area_sqft && (
                <span>📐 {property.properties.area_sqft.toLocaleString()} sqft</span>
              )}
            </div>
            
            {property.properties.featured && (
              <div style={{
                marginTop: '8px',
                display: 'inline-block',
                padding: '2px 8px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}>
                ⭐ FEATURED
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
