import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from '../components/Toast/Toast';
import ComparisonContext from './comparisonContextStore';

const COMPARACAO_STORAGE_KEY = 'logym_comparacao_academias';

const lerAcademiasSelecionadas = () => {
  try {
    const valorSalvo = sessionStorage.getItem(COMPARACAO_STORAGE_KEY);
    const academias = JSON.parse(valorSalvo);

    if (!Array.isArray(academias)) {
      return [];
    }

    const ids = new Set();

    return academias.reduce((selecionadas, academia) => {
      if (!academia?.id || ids.has(String(academia.id))) {
        return selecionadas;
      }

      ids.add(String(academia.id));
      selecionadas.push({
        id: academia.id,
        nome: typeof academia.nome === 'string' && academia.nome.trim()
          ? academia.nome
          : 'Academia selecionada'
      });

      return selecionadas;
    }, []).slice(0, 3);
  } catch {
    return [];
  }
};

export function ComparisonProvider({ children, currentUser }) {
  const [academiasSelecionadas, setAcademiasSelecionadas] = useState(lerAcademiasSelecionadas);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'warning' });
  const podeComparar = currentUser?.nivelAcesso === 'USER';

  useEffect(() => {
    sessionStorage.setItem(COMPARACAO_STORAGE_KEY, JSON.stringify(academiasSelecionadas));
  }, [academiasSelecionadas]);

  const isAcademiaSelecionada = useCallback((academiaId) => (
    academiasSelecionadas.some((academia) => String(academia.id) === String(academiaId))
  ), [academiasSelecionadas]);

  const adicionarAcademia = useCallback((academia) => {
    if (!academia?.id || isAcademiaSelecionada(academia.id)) {
      return false;
    }

    if (academiasSelecionadas.length >= 3) {
      setToast({
        open: true,
        message: 'Você pode comparar até 3 academias.',
        variant: 'warning'
      });
      return false;
    }

    setAcademiasSelecionadas((selecionadas) => ([
      ...selecionadas,
      {
        id: academia.id,
        nome: academia.nome?.trim() || 'Academia selecionada'
      }
    ]));

    return true;
  }, [academiasSelecionadas.length, isAcademiaSelecionada]);

  const removerAcademia = useCallback((academiaId) => {
    setAcademiasSelecionadas((selecionadas) => (
      selecionadas.filter((academia) => String(academia.id) !== String(academiaId))
    ));
  }, []);

  const limparComparacao = useCallback(() => {
    setAcademiasSelecionadas([]);
  }, []);

  const value = useMemo(() => ({
    academiasSelecionadas,
    podeComparar,
    adicionarAcademia,
    removerAcademia,
    limparComparacao,
    isAcademiaSelecionada
  }), [
    academiasSelecionadas,
    podeComparar,
    adicionarAcademia,
    removerAcademia,
    limparComparacao,
    isAcademiaSelecionada
  ]);

  return (
    <ComparisonContext.Provider value={value}>
      {children}
      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((atual) => ({ ...atual, open: false }))}
      />
    </ComparisonContext.Provider>
  );
}
