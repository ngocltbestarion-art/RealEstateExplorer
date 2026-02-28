import React, { useState, useEffect } from 'react';
import { PropertyFeature } from '../../types/property';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useAuth } from '../../contexts/AuthContext';
import { getSimilarProperties } from '../../api/recommendationApi';

interface Amenity {
  id: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
}

interface PropertyDetailsModalProps {
  property: PropertyFeature;
  onClose: () => void;
  showAmenities?: boolean;
  onPropertySelect?: (property: PropertyFeature) => void;
}

const AMENITY_ICONS: Record<string, string> = {
  school: '🏫',
  hospital: '🏥',
  pharmacy: '💊',
  supermarket: '🛒',
  restaurant: '🍽️',
  cafe: '☕',
  park: '🌳',
  bank: '🏦',
  police: '👮',
  fire_station: '🚒',
  bus_station: '🚌',
  subway_station: '🚇'
};

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ 
  property, 
  onClose, 
  showAmenities = false,
  onPropertySelect 
}) => {
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'amenities'>('details');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [recommendations, setRecommendations] = useState<PropertyFeature[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  
  const props = property.properties;
  const images = props.images || [props.primary_image || 'https://via.placeholder.com/800x600'];
  const isFavorite = favoriteIds.includes(props.id);

  useEffect(() => {
    if (showAmenities && activeTab === 'amenities') {
      loadNearbyAmenities();
    }
  }, [activeTab, showAmenities]);

  useEffect(() => {
    loadRecommendations();
  }, [property.properties.id]);

  const loadRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const similar = await getSimilarProperties(property.properties.id);
      setRecommendations(similar);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const loadNearbyAmenities = async () => {
    setLoadingAmenities(true);
    try {
      // Get property center
      if (property.geometry.type !== 'Polygon') return;
      
      const coords = (property.geometry as any).coordinates[0];
      const centerLat = coords.reduce((sum: number, c: number[]) => sum + c[1], 0) / coords.length;
      const centerLon = coords.reduce((sum: number, c: number[]) => sum + c[0], 0) / coords.length;

      // Fetch amenities from Overpass API
      const types = ['school', 'hospital', 'pharmacy', 'supermarket', 'restaurant', 'cafe', 'park', 'bank'];
      const radius = 1000;
      const amenityFilter = types.map(t => `node["amenity"="${t}"](around:${radius},${centerLat},${centerLon});`).join('\n');
      
      const query = `
        [out:json][timeout:25];
        (
          ${amenityFilter}
        );
        out body;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();
      
      const fetchedAmenities: Amenity[] = data.elements.map((element: any) => {
        const distance = calculateDistance(centerLat, centerLon, element.lat, element.lon);
        return {
          id: element.id.toString(),
          type: element.tags.amenity,
          name: element.tags.name || `${element.tags.amenity}`,
          lat: element.lat,
          lon: element.lon,
          distance
        };
      });

      fetchedAmenities.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setAmenities(fetchedAmenities.slice(0, 20)); // Top 20 closest
    } catch (error) {
      console.error('Failed to load amenities:', error);
    } finally {
      setLoadingAmenities(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
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
                transition: 'all 0.2s',
                flexShrink: 0
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

          {/* Tabs */}
          {showAmenities && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '16px'
            }}>
              <button
                onClick={() => setActiveTab('details')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'details' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🏠 Details
              </button>
              <button
                onClick={() => setActiveTab('amenities')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: activeTab === 'amenities' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🗺️ Nearby Amenities
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '24px'
        }}>
          {activeTab === 'details' ? (
            <>{/* Details content */}
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

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '2px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
                💡 You May Also Like
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {recommendations.map((rec) => (
                  <div
                    key={rec.properties.id}
                    onClick={() => {
                      if (onPropertySelect) {
                        onPropertySelect(rec);
                      }
                    }}
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <img
                      src={rec.properties.primary_image || 'https://via.placeholder.com/400x300'}
                      alt={rec.properties.name}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '16px' }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#111827',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {rec.properties.name}
                      </div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#667eea',
                        marginBottom: '8px'
                      }}>
                        ${rec.properties.price?.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        📍 {rec.properties.address}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {rec.properties.bedrooms && (
                          <span>🛏️ {rec.properties.bedrooms}</span>
                        )}
                        {rec.properties.bathrooms && (
                          <span>🚿 {rec.properties.bathrooms}</span>
                        )}
                        {rec.properties.area_sqft && (
                          <span>📐 {rec.properties.area_sqft.toLocaleString()} sqft</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </>) : (
            /* Amenities Tab */
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
                🗺️ Nearby Amenities (within 1km)
              </h3>
              
              {loadingAmenities ? (
                <div style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>Loading nearby amenities...</div>
                </div>
              ) : amenities.length === 0 ? (
                <div style={{
                  padding: '60px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>No amenities found nearby</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>Try expanding the search radius</div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                        border: '2px solid #e5e7eb'
                      }}>
                        {AMENITY_ICONS[amenity.type] || '📍'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          {amenity.name}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {amenity.type.replace('_', ' ')}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        📍 {formatDistance(amenity.distance || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
