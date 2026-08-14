// src/pages/Admin/adminFormatters.js
export const formatarData = (data) => {
  if (!data) return 'Não informado';

  return new Date(data).toLocaleDateString('pt-BR');
};

export const formatarCPF = (cpf) => {
  if (!cpf) return 'Não informado';

  const numeros = String(cpf).replace(/\D/g, '');

  if (numeros.length !== 11) {
    return cpf;
  }

  return numeros.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
};

export const formatarCNPJ = (cnpj) => {
  if (!cnpj) return 'Não informado';

  const numeros = String(cnpj).replace(/\D/g, '');

  if (numeros.length !== 14) {
    return cnpj;
  }

  return numeros.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

export const formatarCEP = (cep) => {
  if (!cep) return 'Não informado';

  const numeros = String(cep).replace(/\D/g, '');

  if (numeros.length !== 8) {
    return cep;
  }

  return numeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const formatarNota = (nota) => {
  if (nota === null || nota === undefined) {
    return 'Sem avaliações';
  }

  return Number(nota).toFixed(1);
};

export const getStatusUsuarioVisual = (status) => {
  if (status === 'ATIVO') return 'ATIVO';
  if (status === 'INATIVO') return 'INATIVO';
  if (status === 'SUSPENSO') return 'SUSPENSO';
  return status || 'Não informado';
};

export const getStatusLabel = (status) => {
  if (status === 'ATIVO') return 'ATIVO';
  if (status === 'INATIVO') return 'INATIVO';
  if (status === 'SUSPENSA') return 'SUSPENSA';
  if (status === 'SUSPENSO') return 'SUSPENSO';
  return status || 'Não informado';
};

export const getNomeGerente = (academia) => {
  return academia.gerente?.nome || academia.gerente?.usuario?.nome || 'Não informado';
};
