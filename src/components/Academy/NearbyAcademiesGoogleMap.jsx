import { useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useApiLoadingStatus,
  useMap
} from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';

import { formatarDistancia, montarEnderecoResumido } from './nearbyAcademiesMapUtils';

const criarIconePin = (cor, tamanho) => ({
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg width="${tamanho.largura}" height="${tamanho.altura}" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.716 23.284 0 15 0Z" fill="${cor}"/><circle cx="15" cy="15" r="5" fill="#ffffff"/></svg>`
  )}`,
  scaledSize: { width: tamanho.largura, height: tamanho.altura },
  anchor: { x: tamanho.largura / 2, y: tamanho.altura }
});

const userMarkerIcon = criarIconePin('#f97316', { largura: 30, altura: 42 });
const academyMarkerIcon = criarIconePin('#343434', { largura: 28, altura: 39 });

function AjustarEnquadramento({ pontos }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps) {
      return undefined;
    }

    if (pontos.length === 1) {
      map.setCenter(pontos[0]);
      map.setZoom(16);
      return undefined;
    }

    const bounds = new window.google.maps.LatLngBounds();
    pontos.forEach((ponto) => bounds.extend(ponto));
    map.fitBounds(bounds, 40);

    const listener = window.google.maps.event.addListenerOnce(map, 'idle', () => {
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
    });

    return () => listener.remove();
  }, [map, pontos]);

  return null;
}

function NearbyAcademiesGoogleMapContent({ coordenadasUsuario, academiasComCoordenadas, onError }) {
  const [academiaSelecionada, setAcademiaSelecionada] = useState(null);
  const statusDaApi = useApiLoadingStatus();
  const pontosDoMapa = useMemo(
    () => [coordenadasUsuario, ...academiasComCoordenadas.map(({ coordenadas }) => coordenadas)],
    [academiasComCoordenadas, coordenadasUsuario]
  );

  useEffect(() => {
    setAcademiaSelecionada(null);
  }, [coordenadasUsuario, academiasComCoordenadas]);

  useEffect(() => {
    if (statusDaApi === 'FAILED' || statusDaApi === 'AUTH_FAILURE') {
      onError();
    }
  }, [onError, statusDaApi]);

  return (
    <Map
      defaultCenter={coordenadasUsuario}
      defaultZoom={14}
      gestureHandling="cooperative"
      disableDefaultUI={false}
      streetViewControl={false}
      mapTypeControl={false}
      className="nearby-academies-map-canvas"
      onClick={() => setAcademiaSelecionada(null)}
    >
      <AjustarEnquadramento pontos={pontosDoMapa} />

      <Marker position={coordenadasUsuario} icon={userMarkerIcon} title="Sua localização" />

      {academiasComCoordenadas.map(({ academia, distanciaKm, coordenadas }) => (
        <Marker
          key={academia.id}
          position={coordenadas}
          icon={academyMarkerIcon}
          title={academia.nome || 'Academia'}
          onClick={() => setAcademiaSelecionada({ academia, distanciaKm, coordenadas })}
        />
      ))}

      {academiaSelecionada && (
        <InfoWindow
          position={academiaSelecionada.coordenadas}
          onClose={() => setAcademiaSelecionada(null)}
          shouldFocus={false}
        >
          <div className="academy-map-info-window">
            <strong>{academiaSelecionada.academia.nome || 'Academia'}</strong>
            {formatarDistancia(academiaSelecionada.distanciaKm) && (
              <p>{formatarDistancia(academiaSelecionada.distanciaKm)}</p>
            )}
            {montarEnderecoResumido(academiaSelecionada.academia) && (
              <p>{montarEnderecoResumido(academiaSelecionada.academia)}</p>
            )}
            <Link
              to={`/academia/${academiaSelecionada.academia.id}`}
              className="academy-map-details-button"
            >
              Ver detalhes
            </Link>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

function NearbyAcademiesGoogleMap({ apiKey, coordenadasUsuario, academiasComCoordenadas, onError }) {
  return (
    <APIProvider apiKey={apiKey} language="pt-BR" region="BR" onError={onError}>
      <NearbyAcademiesGoogleMapContent
        coordenadasUsuario={coordenadasUsuario}
        academiasComCoordenadas={academiasComCoordenadas}
        onError={onError}
      />
    </APIProvider>
  );
}

export default NearbyAcademiesGoogleMap;
