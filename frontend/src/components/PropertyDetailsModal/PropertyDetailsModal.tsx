import React, { useState } from 'react';
import { PropertyFeature } from '../../types/property';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useAuth } from '../../contexts/AuthContext';

interface PropertyDetailsModalProps {
  property: PropertyFeature;
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, onClose }) => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const props = property.properties;
  const images = props.images || [props.primary_image || 'https://via.placeholder.com/800x600'];
  const isFavorite = favoriteIds.includes(props.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
              {props.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              📍 {props.address}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'rotate(0deg)';
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
          {/* Image Gallery */}
          <div style={{ 
            position: 'relative', 
            marginBottom: '32px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f3f4f6'
          }}>
            <img 
              src={images[currentImageIndex]} 
              alt={props.name}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover'
              }}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#374151',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#374151',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ›
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Price and Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0369a1' }}>
                ${props.price?.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                ${Math.round((props.price || 0) / (props.area_sqft || 1)).toLocaleString()} per sqft
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {user && (
                <button
                  onClick={() => toggleFavorite(props.id)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: isFavorite ? '#ef4444' : '#f3f4f6',
                    color: isFavorite ? 'white' : '#374151',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isFavorite ? '❤️' : '🤍'} {isFavorite ? 'Saved' : 'Save'}
                </button>
              )}
              <button
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📞 Contact Owner
              </button>
            </div>
          </div>

          {/* Key Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛏️</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                {props.bedrooms || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Bedrooms</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚿</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                {props.bathrooms || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Bathrooms</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📐</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                {props.area_sqft?.toLocaleString() || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Sqft</div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                {props.floors || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Floors</div>
            </div>
          </div>

          {/* Property Details */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
              Property Details
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Property Type</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  {props.property_type || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: props.status === 'AVAILABLE' ? '#dcfce7' : '#fee2e2',
                    color: props.status === 'AVAILABLE' ? '#166534' : '#991b1b',
                    fontSize: '14px'
                  }}>
                    {props.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Year Built</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  {props.year_built || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Direction</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  {props.direction || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Legal Status</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  {props.legal_status || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Views</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                  👁️ {props.views || 0} views
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {props.description && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
                Description
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#374151',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                margin: 0
              }}>
                {props.description}
              </p>
            </div>
          )}

          {/* Featured Badge */}
          {props.featured && (
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>⭐</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                  Featured Property
                </div>
                <div style={{ fontSize: '14px', color: '#78350f' }}>
                  This is a premium listing with enhanced visibility
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetailsModal;
