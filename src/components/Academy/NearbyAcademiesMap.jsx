import { useCallback, useMemo, useState } from 'react';

import NearbyAcademiesGoogleMap from './NearbyAcademiesGoogleMap';
import NearbyAcademiesLeafletMap from './NearbyAcademiesLeafletMap';
import { getCoordenadasValidas } from './nearbyAcademiesMapUtils';

const MAP_PROVIDER_STORAGE_KEY = 'logym_map_provider';
const GOOGLE_PROVIDER = 'google';
const LEAFLET_PROVIDER = 'leaflet';

const lerProviderDaSessao = (googleDisponivel) => {
  if (!googleDisponivel) {
    return LEAFLET_PROVIDER;
  }

  try {
    return sessionStorage.getItem(MAP_PROVIDER_STORAGE_KEY) === LEAFLET_PROVIDER
      ? LEAFLET_PROVIDER
      : GOOGLE_PROVIDER;
  } catch {
    return GOOGLE_PROVIDER;
  }
};

function NearbyAcademiesMap({ userLatitude, userLongitude, academiasProximas }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleDisponivel = Boolean(apiKey);
  const [providerAtivo, setProviderAtivo] = useState(() => lerProviderDaSessao(googleDisponivel));
  const coordenadasUsuario = useMemo(
    () => getCoordenadasValidas(userLatitude, userLongitude),
    [userLatitude, userLongitude]
  );
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
  const selecionarProvider = useCallback((provider) => {
    setProviderAtivo(provider);

    try {
      sessionStorage.setItem(MAP_PROVIDER_STORAGE_KEY, provider);
    } catch {
      // A indisponibilidade do sessionStorage não impede a troca na sessão atual.
    }
  }, []);
  const ativarFallbackLeaflet = useCallback(() => {
    selecionarProvider(LEAFLET_PROVIDER);
  }, [selecionarProvider]);

  if (!coordenadasUsuario) {
    return (
      <p className="home-location-info" role="status">
        Atualize seu endereço no perfil para visualizar o mapa de academias próximas.
      </p>
    );
  }

  const usandoGoogle = providerAtivo === GOOGLE_PROVIDER && googleDisponivel;
  const textoDoBotao = usandoGoogle ? 'Usar mapa alternativo' : 'Usar Google Maps';

  return (
    <>
      <div className="nearby-academies-map-container">
        {usandoGoogle ? (
          <NearbyAcademiesGoogleMap
            apiKey={apiKey}
            coordenadasUsuario={coordenadasUsuario}
            academiasComCoordenadas={academiasComCoordenadas}
            onError={ativarFallbackLeaflet}
          />
        ) : (
          <NearbyAcademiesLeafletMap
            coordenadasUsuario={coordenadasUsuario}
            academiasComCoordenadas={academiasComCoordenadas}
          />
        )}
      </div>

      <div className="home-map-provider-controls">
        <span className="home-map-provider-label">
          {usandoGoogle ? 'Google Maps' : 'Mapa alternativo'}
        </span>
        <button
          type="button"
          className="home-map-provider-toggle"
          onClick={() => selecionarProvider(usandoGoogle ? LEAFLET_PROVIDER : GOOGLE_PROVIDER)}
          disabled={!usandoGoogle && !googleDisponivel}
          title={!usandoGoogle && !googleDisponivel ? 'Google Maps não está configurado.' : undefined}
        >
          {textoDoBotao}
        </button>
      </div>

      {academiasComCoordenadas.length === 0 && (
        <p className="home-location-info home-nearby-map-empty">
          Nenhuma academia encontrada em até 5 km da sua localização.
        </p>
      )}
    </>
  );
}

export default NearbyAcademiesMap;
