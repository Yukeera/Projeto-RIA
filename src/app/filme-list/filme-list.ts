import { Component, computed, input, output, signal } from '@angular/core';

import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Card } from 'primeng/card';
import { FormsModule } from '@angular/forms';

import { Filme } from '../filme.model';

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
  readonly filmes = input.required<Filme[]>();

  readonly incluir = output<void>();
  readonly detalhar = output<Filme>();
  readonly alterar = output<Filme>();
  readonly remover = output<Filme>();

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
}
