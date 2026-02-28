import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { PropertyFeature } from '../../types/property';

interface HeatmapLayerProps {
  properties: PropertyFeature[];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ properties }) => {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    // Prepare heatmap data: [lat, lng, intensity]
    const heatmapData: [number, number, number][] = [];
    
    // Find min and max price for normalization
    const prices = properties.map(p => p.properties.price || 0).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    properties.forEach(property => {
      if (property.geometry && property.geometry.type === 'Polygon') {
        // Get center of polygon
        const coordinates = property.geometry.coordinates[0];
        let sumLat = 0;
        let sumLng = 0;
        
        coordinates.forEach(coord => {
          sumLng += coord[0];
          sumLat += coord[1];
        });
        
        const centerLng = sumLng / coordinates.length;
        const centerLat = sumLat / coordinates.length;
        
        // Normalize price to 0-1 range for intensity
        const price = property.properties.price || 0;
        const intensity = priceRange > 0 ? (price - minPrice) / priceRange : 0.5;
        
        heatmapData.push([centerLat, centerLng, intensity]);
      }
    });

    // Create heatmap layer
    const heatLayer = (L as any).heatLayer(heatmapData, {
      radius: 40,
      blur: 30,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#0000ff',  // Blue - cheapest
        0.2: '#00ffff',  // Cyan
        0.4: '#00ff00',  // Green
        0.6: '#ffff00',  // Yellow
        0.8: '#ff8800',  // Orange
        1.0: '#ff0000'   // Red - most expensive
      }
    });

    heatLayer.addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, properties]);

  return null;
};

export default HeatmapLayer;
