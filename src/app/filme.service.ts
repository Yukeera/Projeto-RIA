import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Filme } from './filme.model';

@Injectable({ providedIn: 'root' })
export class FilmeService {
  private readonly http = inject(HttpClient);
  // Django REST Framework: rotas com barra final (trailing slash) por padrão.
  private readonly apiUrl = `${environment.apiUrl}/filmes/`;

  listar(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Filme> {
    return this.http.get<Filme>(`${this.apiUrl}${id}/`);
  }

  inserir(filme: Omit<Filme, 'id'>): Observable<Filme> {
    return this.http.post<Filme>(this.apiUrl, filme);
  }

  atualizar(filme: Filme): Observable<Filme> {
    return this.http.put<Filme>(`${this.apiUrl}${filme.id}/`, filme);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
