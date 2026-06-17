import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Card } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

import { Filme } from '../filme.model';
import { FilmeService } from '../filme.service';

@Component({
  selector: 'app-filme-list',
  imports: [
    FormsModule,
    Toolbar,
    Button,
    TableModule,
    InputText,
    Rating,
    Tag,
    IconField,
    InputIcon,
    Card
  ],
  templateUrl: './filme-list.html'
})
export class FilmeListComponent implements OnInit {
  private readonly filmeService = inject(FilmeService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly filmes = signal<Filme[]>([]);
  protected readonly carregando = signal(false);

  protected readonly termoBusca = signal('');

  protected readonly filmesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();
    if (!termo) return this.filmes();
    return this.filmes().filter((f) => f.titulo.toLowerCase().includes(termo));
  });

  protected readonly totalFilmes = computed(() => this.filmes().length);
  protected readonly totalAssistidos = computed(
    () => this.filmes().filter((f) => f.assistido).length
  );
  protected readonly mediaNotas = computed(() => {
    const lista = this.filmes();
    if (lista.length === 0) return 0;
    const soma = lista.reduce((acc, f) => acc + f.nota, 0);
    return Math.round((soma / lista.length) * 10) / 10;
  });

  ngOnInit(): void {
    this.carregar();
  }

  protected irParaInclusao(): void {
    this.router.navigate(['/filmes/incluir']);
  }

  protected irParaDetalhe(filme: Filme): void {
    this.router.navigate(['/filmes/detalhar'], { state: { filme } });
  }

  protected irParaAlteracao(filme: Filme): void {
    this.router.navigate(['/filmes/editar'], { state: { filme } });
  }

  protected confirmarRemocao(filme: Filme): void {
    this.confirmationService.confirm({
      header: 'Remover filme',
      message: `Tem certeza que deseja remover "${filme.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.remover(filme)
    });
  }

  private carregar(): void {
    this.carregando.set(true);
    this.filmeService
      .listar()
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao listar',
            detail: 'Não foi possível carregar os filmes do servidor.'
          });
          return of([] as Filme[]);
        })
      )
      .subscribe((filmes) => {
        this.filmes.set(filmes);
        this.carregando.set(false);
      });
  }

  private remover(filme: Filme): void {
    this.filmeService
      .remover(filme.id)
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao remover',
            detail: `Não foi possível remover "${filme.titulo}".`
          });
          return of();
        }),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Filme removido',
            detail: `"${filme.titulo}" foi removido da watchlist.`
          });
          this.carregar();
        })
      )
      .subscribe();
  }
}
