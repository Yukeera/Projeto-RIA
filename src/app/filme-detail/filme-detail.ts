import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { Filme } from '../filme.model';
import { FilmeService } from '../filme.service';
import { filmeFromHistory } from '../filme.utils';

@Component({
  selector: 'app-filme-detail',
  imports: [FormsModule, Card, Button, Rating, Tag],
  templateUrl: './filme-detail.html'
})
export class FilmeDetailComponent implements OnInit {
  private readonly filmeService = inject(FilmeService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly filme = signal<Filme | undefined>(undefined);

  ngOnInit(): void {
    const base = filmeFromHistory();
    if (!base.id) {
      this.router.navigate(['/filmes/listar']);
      return;
    }

    this.filmeService
      .buscarPorId(base.id)
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao detalhar',
            detail: 'Não foi possível carregar os dados do filme.'
          });
          this.router.navigate(['/filmes/listar']);
          return of();
        }),
        tap((filme) => this.filme.set(filme))
      )
      .subscribe();
  }

  protected voltarParaLista(): void {
    this.router.navigate(['/filmes/listar']);
  }

  protected irParaAlteracao(): void {
    const filme = this.filme();
    if (!filme) return;
    this.router.navigate(['/filmes/editar'], { state: { filme } });
  }
}
