import React from 'react';
import { PropertyFeature } from '../../types/property';

interface ComparisonModalProps {
  properties: PropertyFeature[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ properties, onClose, onRemove }) => {
  const getComparisonValue = (prop: PropertyFeature, field: string): any => {
    return prop.properties[field as keyof typeof prop.properties];
  };

  const formatPrice = (price: number) => `$${price?.toLocaleString()}`;
  const formatArea = (area: number) => `${area?.toLocaleString()} sqft`;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
              Compare Properties
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Side-by-side comparison of {properties.length} properties
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${properties.length}, 1fr)`,
            gap: '20px'
          }}>
            {properties.map((property) => (
              <div key={property.properties.id} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Remove Button */}
                <button
                  onClick={() => onRemove(property.properties.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>

                {/* Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={property.properties.primary_image || 'https://via.placeholder.com/400x300'} 
                    alt={property.properties.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {property.properties.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      padding: '4px 12px',
                      backgroundColor: '#fbbf24',
                      color: '#78350f',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '20px' }}>
                  {/* Name */}
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#111827'
                  }}>
                    {property.properties.name}
                  </h3>

                  {/* Address */}
                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    📍 {property.properties.address}
                  </p>

                  {/* Price */}
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#0369a1' }}>
                      {formatPrice(property.properties.price)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      ${Math.round((property.properties.price || 0) / (property.properties.area_sqft || 1)).toLocaleString()} per sqft
                    </div>
                  </div>

                  {/* Comparison Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <ComparisonRow 
                      label="Type" 
                      value={property.properties.property_type || 'N/A'} 
                    />
                    <ComparisonRow 
                      label="Status" 
                      value={
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '8px',
                          backgroundColor: property.properties.status === 'AVAILABLE' ? '#dcfce7' : '#fee2e2',
                          color: property.properties.status === 'AVAILABLE' ? '#166534' : '#991b1b',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {property.properties.status || 'N/A'}
                        </span>
                      } 
                    />
                    <ComparisonRow 
                      label="Bedrooms" 
                      value={`🛏️ ${property.properties.bedrooms || 'N/A'}`} 
                    />
                    <ComparisonRow 
                      label="Bathrooms" 
                      value={`🚿 ${property.properties.bathrooms || 'N/A'}`} 
                    />
                    <ComparisonRow 
                      label="Area" 
                      value={formatArea(property.properties.area_sqft)} 
                    />
                    <ComparisonRow 
                      label="Floors" 
                      value={`🏢 ${property.properties.floors || 'N/A'}`} 
                    />
                    <ComparisonRow 
                      label="Year Built" 
                      value={property.properties.year_built || 'N/A'} 
                    />
                    <ComparisonRow 
                      label="Direction" 
                      value={property.properties.direction || 'N/A'} 
                    />
                    <ComparisonRow 
                      label="Legal Status" 
                      value={property.properties.legal_status || 'N/A'} 
                    />
                    <ComparisonRow 
                      label="Views" 
                      value={`👁️ ${property.properties.views || 0}`} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Winner Highlights */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700, color: '#0369a1' }}>
              🏆 Quick Comparison
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <HighlightBox 
                label="Lowest Price" 
                value={formatPrice(Math.min(...properties.map(p => p.properties.price || Infinity)))}
              />
              <HighlightBox 
                label="Highest Price" 
                value={formatPrice(Math.max(...properties.map(p => p.properties.price || 0)))}
              />
              <HighlightBox 
                label="Largest Area" 
                value={formatArea(Math.max(...properties.map(p => p.properties.area_sqft || 0)))}
              />
              <HighlightBox 
                label="Most Bedrooms" 
                value={`${Math.max(...properties.map(p => p.properties.bedrooms || 0))} beds`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6'
  }}>
    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600 }}>{value}</span>
  </div>
);

const HighlightBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0369a1' }}>{value}</div>
  </div>
);

export default ComparisonModal;
