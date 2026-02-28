import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';

type Props = {
  onDrawComplete: (geometry: GeoJSON.Feature) => void;
};

const DrawingToolsHandler: React.FC<Props> = ({ onDrawComplete }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: true,
        rectangle: true,
        circle: true,
        marker: false,
        polyline: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
        edit: false
      }
    });

    map.addControl(drawControl);

    const onCreated = (e: any) => {
      const layer = e.layer;
      
      // Clear previous drawings before adding new one
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);
      
      let geojson: GeoJSON.Feature;
      
      // Convert circle to polygon (Leaflet circles are not standard GeoJSON)
      if (e.layerType === 'circle') {
        const center = layer.getLatLng();
        const radius = layer.getRadius(); // in meters
        const points = 64; // number of points to approximate circle
        const coordinates: number[][] = [];
        
        for (let i = 0; i <= points; i++) {
          const angle = (i * 360) / points;
          const lat = center.lat + (radius / 111320) * Math.cos((angle * Math.PI) / 180);
          const lng = center.lng + (radius / (111320 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin((angle * Math.PI) / 180);
          coordinates.push([lng, lat]);
        }
        
        geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        };
      } else {
        geojson = layer.toGeoJSON() as GeoJSON.Feature;
      }
      
      onDrawComplete(geojson);
    };

    const onDeleted = (e: any) => {
      // When user deletes a drawing, reload all properties
      drawnItems.clearLayers();
      // Trigger a reload by passing null or empty feature
      onDrawComplete({ type: 'Feature', properties: { deleted: true }, geometry: null as any });
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onDrawComplete]);

  return null;
};

export default DrawingToolsHandler;

