import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import { academyMarkerIcon, getCoordenadasValidas } from './leafletMapUtils';

const formatarDistancia = (distanciaKm) => {
  const distancia = Number(distanciaKm);

  if (!Number.isFinite(distancia) || distancia < 0) {
    return '';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(distancia)} km de você`;
};

const montarEnderecoResumido = (academia) => {
  return [academia?.endereco, academia?.bairro, academia?.cidade, academia?.estado]
    .filter(Boolean)
    .join(' - ');
};

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

function NearbyAcademiesMap({ userLatitude, userLongitude, academiasProximas }) {
  const coordenadasUsuario = getCoordenadasValidas(userLatitude, userLongitude);
  const academiasComCoordenadas = useMemo(() => {
    if (!Array.isArray(academiasProximas)) {
      return [];
    }

    return academiasProximas
      .map(({ academia, distanciaKm }) => ({
        academia,
        distanciaKm,
        coordenadas: getCoordenadasValidas(academia?.latitude, academia?.longitude)
      }))
      .filter(({ academia, coordenadas }) => academia && coordenadas);
  }, [academiasProximas]);

  if (!coordenadasUsuario) {
    return (
      <p className="home-location-info" role="status">
        Atualize seu endereço no perfil para visualizar o mapa de academias próximas.
      </p>
    );
  }

  const pontosDoMapa = [
    coordenadasUsuario,
    ...academiasComCoordenadas.map(({ coordenadas }) => coordenadas)
  ];

  return (
    <div className="nearby-academies-map-container">
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

        <Marker position={coordenadasUsuario} icon={academyMarkerIcon}>
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
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default NearbyAcademiesMap;
