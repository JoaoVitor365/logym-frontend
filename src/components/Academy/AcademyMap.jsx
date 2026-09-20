import { useCallback, useMemo, useState } from 'react';

import AcademyGoogleMap from './AcademyGoogleMap';
import AcademyLeafletMap from './AcademyLeafletMap';
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

function AcademyMap({ latitude, longitude, nome, endereco }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleDisponivel = Boolean(apiKey);
  const [providerAtivo, setProviderAtivo] = useState(() => lerProviderDaSessao(googleDisponivel));
  const coordenadas = useMemo(
    () => getCoordenadasValidas(latitude, longitude),
    [latitude, longitude]
  );
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

  if (!coordenadas) {
    return (
      <p className="academy-map-fallback" role="status">
        Localização indisponível.
      </p>
    );
  }

  const usandoGoogle = providerAtivo === GOOGLE_PROVIDER && googleDisponivel;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordenadas.lat},${coordenadas.lng}`;

  return (
    <>
      <div className="academy-map-container">
        {usandoGoogle ? (
          <AcademyGoogleMap
            apiKey={apiKey}
            coordenadas={coordenadas}
            nome={nome}
            endereco={endereco}
            onError={ativarFallbackLeaflet}
          />
        ) : (
          <AcademyLeafletMap coordenadas={coordenadas} nome={nome} endereco={endereco} />
        )}
      </div>

      <div className="academy-map-controls">
        <a
          className="academy-map-directions-button"
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Como chegar
        </a>
        <div className="academy-map-provider-controls">
          <span className="academy-map-provider-label">
            {usandoGoogle ? 'Google Maps' : 'Mapa alternativo'}
          </span>
          <button
            type="button"
            className="academy-map-provider-toggle"
            onClick={() => selecionarProvider(usandoGoogle ? LEAFLET_PROVIDER : GOOGLE_PROVIDER)}
            disabled={!usandoGoogle && !googleDisponivel}
            title={!usandoGoogle && !googleDisponivel ? 'Google Maps não está configurado.' : undefined}
          >
            {usandoGoogle ? 'Usar mapa alternativo' : 'Usar Google Maps'}
          </button>
        </div>
      </div>
    </>
  );
}

export default AcademyMap;
