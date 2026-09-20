export const formatarDistancia = (distanciaKm) => {
  const distancia = Number(distanciaKm);

  if (!Number.isFinite(distancia) || distancia < 0) {
    return '';
  }

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(distancia)} km de você`;
};

export const montarEnderecoResumido = (academia) => {
  return [academia?.endereco, academia?.bairro, academia?.cidade, academia?.estado]
    .filter(Boolean)
    .join(' - ');
};

export const getCoordenadasValidas = (latitude, longitude) => {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined ||
    String(latitude).trim() === '' ||
    String(longitude).trim() === ''
  ) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
};
