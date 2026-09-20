import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';

import { academyMarkerIcon, userMarkerIcon } from './leafletMapUtils';
import { formatarDistancia, montarEnderecoResumido } from './nearbyAcademiesMapUtils';

function AjustarEnquadramento({ pontos }) {
  const map = useMap();

  useEffect(() => {
    if (pontos.length === 1) {
      map.setView(pontos[0], 16);
      return;
    }

    map.fitBounds(L.latLngBounds(pontos), {
      padding: [40, 40],
      maxZoom: 15
    });
  }, [map, pontos]);

  return null;
}

function NearbyAcademiesLeafletMap({ coordenadasUsuario, academiasComCoordenadas }) {
  const pontosDoMapa = useMemo(
    () => [coordenadasUsuario, ...academiasComCoordenadas.map(({ coordenadas }) => coordenadas)],
    [academiasComCoordenadas, coordenadasUsuario]
  );

  return (
    <MapContainer
      center={coordenadasUsuario}
      zoom={14}
      scrollWheelZoom={false}
      className="nearby-academies-map-canvas"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <AjustarEnquadramento pontos={pontosDoMapa} />

      <Marker position={coordenadasUsuario} icon={userMarkerIcon}>
        <Popup>Sua localização</Popup>
      </Marker>

      {academiasComCoordenadas.map(({ academia, distanciaKm, coordenadas }) => {
        const endereco = montarEnderecoResumido(academia);
        const distanciaFormatada = formatarDistancia(distanciaKm);

        return (
          <Marker key={academia.id} position={coordenadas} icon={academyMarkerIcon}>
            <Popup>
              <strong>{academia.nome || 'Academia'}</strong>
              {distanciaFormatada && <p>{distanciaFormatada}</p>}
              {endereco && <p>{endereco}</p>}
              <Link to={`/academia/${academia.id}`} className="academy-map-details-button">
                Ver detalhes
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default NearbyAcademiesLeafletMap;
