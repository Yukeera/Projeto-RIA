import { Filme } from './filme.model';

export function novoFilmeVazio(): Filme {
  return { id: 0, titulo: '', nota: 0, assistido: false };
}

export function filmeFromHistory(): Filme {
  const state = history.state as { filme?: Filme } | null;
  return state?.filme ? { ...state.filme } : novoFilmeVazio();
}
