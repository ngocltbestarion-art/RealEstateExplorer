import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

export interface Amenity {
  id: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
}

interface AmenitiesLayerProps {
  center: [number, number];
  radius: number; // in meters
  types: string[];
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

const AMENITY_COLORS: Record<string, string> = {
  school: '#3b82f6',
  hospital: '#ef4444',
  pharmacy: '#10b981',
  supermarket: '#f59e0b',
  restaurant: '#8b5cf6',
  cafe: '#ec4899',
  park: '#22c55e',
  bank: '#06b6d4',
  police: '#1e40af',
  fire_station: '#dc2626',
  bus_station: '#f97316',
  subway_station: '#7c3aed'
};

const createAmenityIcon = (type: string) => {
  const emoji = AMENITY_ICONS[type] || '📍';
  const color = AMENITY_COLORS[type] || '#6b7280';
  
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    className: 'amenity-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const AmenitiesLayer: React.FC<AmenitiesLayerProps> = ({ center, radius, types }) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (types.length === 0) {
      setAmenities([]);
      return;
    }
    
    fetchAmenities();
  }, [center, radius, types]);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const [lat, lon] = center;
      
      // Build Overpass query for multiple amenity types
      const amenityFilter = types.map(t => `node["amenity"="${t}"](around:${radius},${lat},${lon});`).join('\n');
      
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
        const distance = calculateDistance(lat, lon, element.lat, element.lon);
        return {
          id: element.id.toString(),
          type: element.tags.amenity,
          name: element.tags.name || `${element.tags.amenity}`,
          lat: element.lat,
          lon: element.lon,
          distance
        };
      });

      // Sort by distance
      fetchedAmenities.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setAmenities(fetchedAmenities);
    } catch (error) {
      console.error('Failed to fetch amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
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

  return (
    <>
      {amenities.map((amenity) => (
        <Marker
          key={amenity.id}
          position={[amenity.lat, amenity.lon]}
          icon={createAmenityIcon(amenity.type)}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#111827'
              }}>
                {AMENITY_ICONS[amenity.type]} {amenity.name}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                Type: {amenity.type.replace('_', ' ')}
              </div>
              {amenity.distance && (
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  📍 Distance: {formatDistance(amenity.distance)}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default AmenitiesLayer;
