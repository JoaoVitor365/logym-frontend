import { useEffect, useState } from 'react';
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useApiLoadingStatus
} from '@vis.gl/react-google-maps';

const academyMarkerIcon = {
  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    '<svg width="28" height="39" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 27 15 27s15-15.75 15-27C30 6.716 23.284 0 15 0Z" fill="#343434"/><circle cx="15" cy="15" r="5" fill="#ffffff"/></svg>'
  )}`,
  scaledSize: { width: 28, height: 39 },
  anchor: { x: 14, y: 39 }
};

function AcademyGoogleMapContent({ coordenadas, nome, endereco, onError }) {
  const [infoWindowAberta, setInfoWindowAberta] = useState(false);
  const statusDaApi = useApiLoadingStatus();

  useEffect(() => {
    if (statusDaApi === 'FAILED' || statusDaApi === 'AUTH_FAILURE') {
      onError();
    }
  }, [onError, statusDaApi]);

  return (
    <Map
      defaultCenter={coordenadas}
      defaultZoom={16}
      gestureHandling="cooperative"
      disableDefaultUI={false}
      streetViewControl={false}
      mapTypeControl={false}
      className="academy-map-canvas"
      onClick={() => setInfoWindowAberta(false)}
    >
      <Marker
        position={coordenadas}
        icon={academyMarkerIcon}
        title={nome || 'Academia'}
        onClick={() => setInfoWindowAberta(true)}
      />

      {infoWindowAberta && (
        <InfoWindow position={coordenadas} onClose={() => setInfoWindowAberta(false)} shouldFocus={false}>
          <div className="academy-map-info-window">
            <strong>{nome || 'Academia'}</strong>
            {endereco && <p>{endereco}</p>}
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

function AcademyGoogleMap({ apiKey, coordenadas, nome, endereco, onError }) {
  return (
    <APIProvider apiKey={apiKey} language="pt-BR" region="BR" onError={onError}>
      <AcademyGoogleMapContent
        coordenadas={coordenadas}
        nome={nome}
        endereco={endereco}
        onError={onError}
      />
    </APIProvider>
  );
}

export default AcademyGoogleMap;
