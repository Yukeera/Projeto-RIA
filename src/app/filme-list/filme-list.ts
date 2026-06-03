import { Component, computed, inject, output, signal } from '@angular/core';

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
export class FilmeListComponent {
  private readonly filmeService = inject(FilmeService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly incluir = output<void>();
  readonly detalhar = output<Filme>();
  readonly alterar = output<Filme>();

  protected readonly filmes = this.filmeService.filmes;

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

  private remover(filme: Filme): void {
    this.filmeService.remover(filme.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Filme removido',
      detail: `"${filme.titulo}" foi removido da watchlist.`
    });
  }
}
