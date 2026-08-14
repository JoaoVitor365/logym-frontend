// src/utils/documentValidators.js

export const isValidCPF = (cpf) => {
  const cleanCPF = String(cpf || '').replace(/\D/g, '');

  if (cleanCPF.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF.charAt(i), 10) * (10 - i);
  }

  let primeiroDigito = 11 - (soma % 11);
  primeiroDigito = primeiroDigito >= 10 ? 0 : primeiroDigito;

  if (primeiroDigito !== parseInt(cleanCPF.charAt(9), 10)) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF.charAt(i), 10) * (11 - i);
  }

  let segundoDigito = 11 - (soma % 11);
  segundoDigito = segundoDigito >= 10 ? 0 : segundoDigito;

  return segundoDigito === parseInt(cleanCPF.charAt(10), 10);
};

export const isValidCNPJ = (cnpj) => {
  const cleanCNPJ = String(cnpj || '').replace(/\D/g, '');

  if (cleanCNPJ.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  const calcularDigito = (base, pesos) => {
    let soma = 0;

    for (let i = 0; i < pesos.length; i++) {
      soma += parseInt(base.charAt(i), 10) * pesos[i];
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const primeiroDigito = calcularDigito(cleanCNPJ.substring(0, 12), pesosPrimeiroDigito);
  const segundoDigito = calcularDigito(cleanCNPJ.substring(0, 13), pesosSegundoDigito);

  return (
    primeiroDigito === parseInt(cleanCNPJ.charAt(12), 10) &&
    segundoDigito === parseInt(cleanCNPJ.charAt(13), 10)
  );
};