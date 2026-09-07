import FotoAcademiaService from '../services/FotoAcademiaService';

export const getFotoPrincipalUrl = (fotoPrincipal) => {
  if (!fotoPrincipal) {
    return null;
  }

  if (typeof fotoPrincipal === 'number') {
    return FotoAcademiaService.getImagemUrl(fotoPrincipal);
  }

  if (typeof fotoPrincipal === 'string') {
    const valor = fotoPrincipal.trim();

    if (!valor) {
      return null;
    }

    return /^\d+$/.test(valor) ? FotoAcademiaService.getImagemUrl(valor) : valor;
  }

  if (fotoPrincipal.id) {
    return FotoAcademiaService.getImagemUrl(fotoPrincipal.id);
  }

  return null;
};
