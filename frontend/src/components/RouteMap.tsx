import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  geometry: any;
}

const RecenterMap = ({ geometry }: { geometry: any }) => {
  const map = useMap();
  useEffect(() => {
    if (geometry) {
      const bounds1 = L.geoJSON(geometry.leg1).getBounds();
      const bounds2 = L.geoJSON(geometry.leg2).getBounds();
      map.fitBounds(bounds1.extend(bounds2));
    }
  }, [geometry, map]);
  return null;
};

const RouteMap: React.FC<Props> = ({ geometry }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[400px]">
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geometry && (
          <>
            <GeoJSON data={geometry.leg1} style={{ color: 'blue', weight: 4 }} />
            <GeoJSON data={geometry.leg2} style={{ color: 'red', weight: 4 }} />
            <RecenterMap geometry={geometry} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
