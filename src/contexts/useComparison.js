import { useContext } from 'react';
import ComparisonContext from './comparisonContextStore';

export function useComparison() {
  const context = useContext(ComparisonContext);

  if (!context) {
    throw new Error('useComparison deve ser usado dentro de ComparisonProvider.');
  }

  return context;
}
