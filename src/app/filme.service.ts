import { Injectable, signal } from '@angular/core';

import { Filme } from './filme.model';

@Injectable({ providedIn: 'root' })
export class FilmeService {
  private readonly _filmes = signal<Filme[]>([
    { id: 1, titulo: 'O Senhor dos Anéis: A Sociedade do Anel', nota: 10, assistido: true },
    { id: 2, titulo: 'Duna: Parte Dois', nota: 9, assistido: true },
    { id: 3, titulo: 'Oppenheimer', nota: 8, assistido: false },
    { id: 4, titulo: 'Interestelar', nota: 10, assistido: true }
  ]);

  readonly filmes = this._filmes.asReadonly();

  listar(): Filme[] {
    return this._filmes();
  }

  buscarPorId(id: number): Filme | undefined {
    return this._filmes().find((f) => f.id === id);
  }

  inserir(filme: Omit<Filme, 'id'>): Filme {
    const novo: Filme = { ...filme, id: this.proximoId() };
    this._filmes.update((lista) => [...lista, novo]);
    return novo;
  }

  atualizar(filme: Filme): void {
    this._filmes.update((lista) =>
      lista.map((f) => (f.id === filme.id ? { ...filme } : f))
    );
  }

  remover(id: number): void {
    this._filmes.update((lista) => lista.filter((f) => f.id !== id));
  }

  private proximoId(): number {
    const ids = this._filmes().map((f) => f.id);
    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
  }
}
