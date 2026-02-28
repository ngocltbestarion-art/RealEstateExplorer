import React from 'react';
import { PropertyFeature } from '../../types/property';
import { useFavorites } from '../../contexts/FavoriteContext';

interface PropertyListProps {
  properties: PropertyFeature[];
  onPropertyClick: (property: PropertyFeature) => void;
  comparisonMode?: boolean;
  selectedForComparison?: number[];
  onToggleComparison?: (id: number) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  onPropertyClick,
  comparisonMode = false,
  selectedForComparison = [],
  onToggleComparison
}) => {
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

      {properties.map((property) => {
        const isSelected = selectedForComparison.includes(property.properties.id);
        const canSelect = selectedForComparison.length < 3 || isSelected;
        
        return (
        <div
          key={property.properties.id}
          style={{
            border: isSelected ? '2px solid #667eea' : '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: isSelected ? '#f0f9ff' : 'white',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          onClick={() => !comparisonMode && onPropertyClick(property)}
        >
          {/* Comparison Checkbox */}
          {comparisonMode && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (canSelect && onToggleComparison) {
                  onToggleComparison(property.properties.id);
                }
              }}
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: isSelected ? '2px solid #667eea' : '2px solid white',
                backgroundColor: isSelected ? '#667eea' : 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: canSelect ? 1 : 0.5,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.2s'
              }}
            >
              {isSelected && <span style={{ color: 'white', fontSize: '16px' }}>✓</span>}
            </div>
          )}
          
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
        );
      })}
    </div>
  );
};

export default PropertyList;
