import React, { useState } from 'react';
import { PropertyFeature } from '../../types/property';
import { useFavorites } from '../../contexts/FavoriteContext';

interface PropertyPopupProps {
  feature: PropertyFeature;
  onClose: () => void;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({ feature, onClose }) => {
  const { properties: prop } = feature;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = prop.images || [];
  const hasImages = images.length > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '400px',
        maxHeight: 'calc(100vh - 40px)',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(255,255,255,0.9)',
          cursor: 'pointer',
          fontSize: '18px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        ×
      </button>

      {hasImages && (
        <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#f3f4f6' }}>
          <img
            src={images[currentImageIndex]}
            alt={prop.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ›
              </button>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
            {prop.name}
          </h2>
          <button
            onClick={() => toggleFavorite(prop.id)}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: 0
            }}
          >
            {isFavorite(prop.id) ? '❤️' : '🤍'}
          </button>
        </div>

        <div style={{ fontSize: '24px', fontWeight: 700, color: '#1d4ed8', marginBottom: '16px' }}>
          {formatPrice(prop.price)}
        </div>

        <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          📍 {prop.address}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '16px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          {prop.bedrooms && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Bedrooms</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>🛏️ {prop.bedrooms}</div>
            </div>
          )}
          {prop.bathrooms && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Bathrooms</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>🚿 {prop.bathrooms}</div>
            </div>
          )}
          {prop.area_sqft && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Area</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>📐 {prop.area_sqft.toLocaleString()} sqft</div>
            </div>
          )}
          {prop.year_built && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Year Built</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>🏗️ {prop.year_built}</div>
            </div>
          )}
          {prop.floors && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Floors</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>🏢 {prop.floors}</div>
            </div>
          )}
          {prop.direction && (
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>Direction</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>🧭 {prop.direction}</div>
            </div>
          )}
        </div>

        {prop.property_type && (
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {prop.property_type}
            </span>
            {prop.status && (
              <span style={{
                display: 'inline-block',
                marginLeft: '8px',
                padding: '4px 12px',
                backgroundColor: prop.status === 'AVAILABLE' ? '#d1fae5' : '#fee2e2',
                color: prop.status === 'AVAILABLE' ? '#065f46' : '#991b1b',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600
              }}>
                {prop.status}
              </span>
            )}
          </div>
        )}

        {prop.description && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Description</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              {prop.description}
            </p>
          </div>
        )}

        {prop.legal_status && (
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Legal Status</h3>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              {prop.legal_status}
            </p>
          </div>
        )}

        {prop.views !== undefined && (
          <div style={{ fontSize: '12px', color: '#999', marginTop: '16px' }}>
            👁️ {prop.views} views
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPopup;
