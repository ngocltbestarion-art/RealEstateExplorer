import React, { useState } from 'react';

interface AmenitiesPanelProps {
  onTypesChange: (types: string[]) => void;
  onRadiusChange: (radius: number) => void;
}

interface AmenityType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const AMENITY_TYPES: AmenityType[] = [
  { id: 'school', label: 'Schools', icon: '🏫', color: '#3b82f6' },
  { id: 'hospital', label: 'Hospitals', icon: '🏥', color: '#ef4444' },
  { id: 'pharmacy', label: 'Pharmacies', icon: '💊', color: '#10b981' },
  { id: 'supermarket', label: 'Supermarkets', icon: '🛒', color: '#f59e0b' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️', color: '#8b5cf6' },
  { id: 'cafe', label: 'Cafes', icon: '☕', color: '#ec4899' },
  { id: 'park', label: 'Parks', icon: '🌳', color: '#22c55e' },
  { id: 'bank', label: 'Banks', icon: '🏦', color: '#06b6d4' },
  { id: 'police', label: 'Police', icon: '👮', color: '#1e40af' },
  { id: 'fire_station', label: 'Fire Stations', icon: '🚒', color: '#dc2626' },
  { id: 'bus_station', label: 'Bus Stations', icon: '🚌', color: '#f97316' },
  { id: 'subway_station', label: 'Subway', icon: '🚇', color: '#7c3aed' }
];

const RADIUS_OPTIONS = [
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
  { value: 5000, label: '5km' }
];

const AmenitiesPanel: React.FC<AmenitiesPanelProps> = ({ onTypesChange, onRadiusChange }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [radius, setRadius] = useState(1000);

  const toggleType = (typeId: string) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(t => t !== typeId)
      : [...selectedTypes, typeId];
    
    setSelectedTypes(newTypes);
    onTypesChange(newTypes);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  const selectAll = () => {
    const allTypes = AMENITY_TYPES.map(t => t.id);
    setSelectedTypes(allTypes);
    onTypesChange(allTypes);
  };

  const clearAll = () => {
    setSelectedTypes([]);
    onTypesChange([]);
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: '#111827'
        }}>
          🗺️ Nearby Amenities
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={selectAll}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              background: 'white',
              color: '#6b7280',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            All
          </button>
          <button
            onClick={clearAll}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              background: 'white',
              color: '#6b7280',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Radius Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '8px'
        }}>
          Search Radius
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {RADIUS_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleRadiusChange(option.value)}
              style={{
                padding: '8px',
                fontSize: '12px',
                border: radius === option.value ? 'none' : '1px solid #e5e7eb',
                borderRadius: '6px',
                background: radius === option.value ? '#667eea' : 'white',
                color: radius === option.value ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenity Types */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '8px'
        }}>
          Amenity Types ({selectedTypes.length} selected)
        </label>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {AMENITY_TYPES.map(type => {
            const isSelected = selectedTypes.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                style={{
                  padding: '10px 12px',
                  border: isSelected ? `2px solid ${type.color}` : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: isSelected ? `${type.color}15` : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: type.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {type.icon}
                </div>
                <div style={{
                  flex: 1,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isSelected ? type.color : '#374151'
                }}>
                  {type.label}
                </div>
                {isSelected && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: type.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bfdbfe'
      }}>
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: '#1e40af',
          lineHeight: '1.5'
        }}>
          💡 Click on a property to see nearby amenities. Select amenity types and adjust search radius above.
        </p>
      </div>
    </div>
  );
};

export default AmenitiesPanel;
