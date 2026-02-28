import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, WMSTileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L, { LatLngExpression, GeoJSON as LeafletGeoJSON } from 'leaflet';
import { PropertyFeature, PropertyFilter } from '../../types/property';
import { getProperties, getFeaturedProperties, filterProperties } from '../../api/propertyApi';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import LayerToggle from '../LayerToggle/LayerToggle';
import PropertyPopup from '../PropertyPopup/PropertyPopup';
import DrawingToolsHandler from '../DrawingToolsHandler/DrawingToolsHandler';
import SearchBar from '../SearchBar/SearchBar';
import LoginModal from '../LoginModal/LoginModal';
import FilterPanel from '../FilterPanel/FilterPanel';
import PropertyList from '../PropertyList/PropertyList';

const DEFAULT_CENTER: LatLngExpression = [40.7128, -74.006];

// Component to handle map instance
const MapController: React.FC<{ mapRef: React.MutableRefObject<L.Map | null> }> = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

type LayerVisibility = {
  parcels: boolean;
  schools: boolean;
  amenities: boolean;
};

type ViewMode = 'all' | 'featured' | 'favorites' | 'filtered';

const MapView: React.FC = () => {
  const [properties, setProperties] = useState<PropertyFeature[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyFeature | null>(null);
  const [layersVisibility, setLayersVisibility] = useState<LayerVisibility>({
    parcels: true,
    schools: false,
    amenities: false
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const parcelsLayerRef = useRef<LeafletGeoJSON | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    loadAllProperties();
  }, []);

  // Auto-fit bounds when properties change
  useEffect(() => {
    if (properties.length > 0 && parcelsLayerRef.current && mapRef.current) {
      const bounds = parcelsLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 14  // Prevent zooming in too close
        });
      }
    }
  }, [properties]);

  const loadAllProperties = () => {
    getProperties()
      .then(setProperties)
      .catch(console.error);
    setViewMode('all');
  };

  const loadFeaturedProperties = () => {
    getFeaturedProperties()
      .then(setProperties)
      .catch(console.error);
    setViewMode('featured');
  };

  const loadFavoriteProperties = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    getProperties()
      .then(allProps => {
        const favProps = allProps.filter(p => favoriteIds.includes(p.properties.id));
        setProperties(favProps);
      })
      .catch(console.error);
    setViewMode('favorites');
  };

  const handleFilterChange = (filter: PropertyFilter) => {
    filterProperties(filter)
      .then(page => {
        // Backend now returns GeoJSON features in content
        setProperties(page.content as PropertyFeature[]);
      })
      .catch(console.error);
    setViewMode('filtered');
  };

  const handleFeatureClick = (feature: PropertyFeature, latlng: L.LatLng) => {
    setSelectedProperty(feature);
  };

  const handleDrawComplete = async (geoJson: GeoJSON.Feature) => {
    try {
      // Check if this is a delete event
      if (geoJson.properties?.deleted) {
        // Reload all properties when drawing is deleted
        loadAllProperties();
        return;
      }
      
      const { getPropertiesWithinGeometry } = await import('../../api/propertyApi');
      const result = await getPropertiesWithinGeometry(geoJson);
      setProperties(result);
      setViewMode('filtered');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSelect = (property: PropertyFeature) => {
    // Set selected property and zoom to it
    setSelectedProperty(property);
    
    if (mapRef.current && property.geometry) {
      const bounds = L.geoJSON(property as any).getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { 
          padding: [100, 100],
          maxZoom: 16
        });
      }
    }
  };

  const handleSearchClick = async () => {
    if (searchQuery.length < 2) return;
    
    try {
      const results = await searchProperties(searchQuery);
      setProperties(results);
      setViewMode('filtered');
      
      // Auto-fit bounds to search results
      if (results.length > 0 && mapRef.current) {
        const bounds = L.geoJSON({ type: 'FeatureCollection', features: results } as any).getBounds();
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 14
          });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearch = (results: PropertyFeature[]) => {
    // Display search results on map
    setProperties(results);
    setViewMode('filtered');
    
    // Auto-fit bounds to search results
    if (results.length > 0 && mapRef.current) {
      const bounds = L.geoJSON({ type: 'FeatureCollection', features: results } as any).getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 14
        });
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        display: 'grid',
        gridTemplateColumns: '200px 1fr 200px',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 10,
        gap: '20px'
      }}>
        {/* Left: Title */}
        <h1 style={{ fontSize: '19px', fontWeight: 700, margin: 0, color: 'white', letterSpacing: '-0.5px' }}>
          🏠 Real Estate Explorer
        </h1>
        
        {/* Center: Search */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', gap: '8px', width: '350px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.length >= 2) {
                    handleSearchClick();
                  }
                }}
                style={{
                  width: '250px',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }}>
                🔍
              </div>
            </div>
            <button
              onClick={handleSearchClick}
              disabled={searchQuery.length < 2}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: searchQuery.length < 2 ? 'rgba(255,255,255,0.3)' : 'white',
                color: searchQuery.length < 2 ? 'rgba(255,255,255,0.5)' : '#667eea',
                cursor: searchQuery.length < 2 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: searchQuery.length < 2 ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Right: User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          {user ? (
            <>
              <span style={{ fontSize: '14px', color: 'white', whiteSpace: 'nowrap', fontWeight: 500 }}>
                👤 {user.username}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '7px 14px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                padding: '7px 18px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* View Mode Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #f3f4f6',
            padding: '12px',
            gap: '8px',
            backgroundColor: '#fafafa'
          }}>
            <button
              onClick={loadAllProperties}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                backgroundColor: viewMode === 'all' ? '#2563eb' : 'white',
                color: viewMode === 'all' ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'all' ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'all') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'all') {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              All
            </button>
            <button
              onClick={loadFeaturedProperties}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                backgroundColor: viewMode === 'featured' ? '#2563eb' : 'white',
                color: viewMode === 'featured' ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'featured' ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'featured') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'featured') {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              ⭐ Featured
            </button>
            <button
              onClick={loadFavoriteProperties}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                backgroundColor: viewMode === 'favorites' ? '#2563eb' : 'white',
                color: viewMode === 'favorites' ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'favorites' ? '0 2px 4px rgba(37, 99, 235, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'favorites') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'favorites') {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              ❤️ Saved
            </button>
          </div>

          {/* Toggle Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                flex: 1,
                padding: '10px',
                border: showFilters ? 'none' : '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: showFilters ? '#2563eb' : 'white',
                color: showFilters ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              🔍 Filters
            </button>
            <button
              onClick={() => setShowPropertyList(!showPropertyList)}
              style={{
                flex: 1,
                padding: '10px',
                border: showPropertyList ? 'none' : '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: showPropertyList ? '#2563eb' : 'white',
                color: showPropertyList ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              📋 List
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {showFilters && <FilterPanel onFilterChange={handleFilterChange} />}
            {showPropertyList && !showFilters && (
              <PropertyList
                properties={properties}
                onPropertyClick={setSelectedProperty}
              />
            )}
            {!showFilters && !showPropertyList && (
              <div style={{ padding: '16px' }}>
                <LayerToggle
                  visibility={layersVisibility}
                  onChange={setLayersVisibility}
                />
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <MapController mapRef={mapRef} />
            
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {layersVisibility.parcels && (
              <WMSTileLayer
                url="http://localhost:8081/geoserver/realestate/wms"
                params={{
                  layers: 'realestate:parcels',
                  format: 'image/png',
                  transparent: true,
                  version: '1.1.0'
                }}
                opacity={0.5}
              />
            )}

            {layersVisibility.parcels && properties.length > 0 && (
              <GeoJSON
                key={JSON.stringify(properties.map(p => p.properties.id))}
                ref={parcelsLayerRef}
                data={properties as any}
                style={() => ({
                  color: '#ef4444',
                  weight: 3,
                  fillColor: '#fca5a5',
                  fillOpacity: 0.6
                })}
                onEachFeature={(feature, layer) => {
                  layer.on('click', (e: L.LeafletMouseEvent) => {
                    handleFeatureClick(feature as any, e.latlng);
                  });
                }}
              />
            )}

            <DrawingToolsHandler onDrawComplete={handleDrawComplete} />
          </MapContainer>

          {selectedProperty && (
            <PropertyPopup
              feature={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default MapView;
