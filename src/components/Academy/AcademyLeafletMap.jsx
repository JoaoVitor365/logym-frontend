import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { academyMarkerIcon } from './leafletMapUtils';

function AcademyLeafletMap({ coordenadas, nome, endereco }) {
  return (
    <MapContainer
      center={coordenadas}
      zoom={16}
      scrollWheelZoom={false}
      className="academy-map-canvas"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={coordenadas} icon={academyMarkerIcon}>
        <Popup>
          <strong>{nome || 'Academia'}</strong>
          {endereco && <p>{endereco}</p>}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default AcademyLeafletMap;
