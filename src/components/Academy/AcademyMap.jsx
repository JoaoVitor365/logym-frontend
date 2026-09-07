import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { academyMarkerIcon, getCoordenadasValidas } from './leafletMapUtils';

function AcademyMap({ latitude, longitude, nome, endereco }) {
  const coordenadas = getCoordenadasValidas(latitude, longitude);

  if (!coordenadas) {
    return (
      <p className="academy-map-fallback" role="status">
        Localização indisponível.
      </p>
    );
  }

  return (
    <div className="academy-map-container">
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
    </div>
  );
}

export default AcademyMap;
