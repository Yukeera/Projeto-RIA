import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  disabled,
  form,
  FormField,
  max,
  maxLength,
  min,
  minLength,
  required
} from '@angular/forms/signals';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';

import { Filme } from './filme.model';

type ModoDialog = 'incluir' | 'alterar' | 'detalhar';

function novoFilmeVazio(): Filme {
  return { id: 0, titulo: '', nota: 0, assistido: false };
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    FormField,
    Toolbar,
    Button,
    TableModule,
    Dialog,
    InputText,
    InputNumber,
    Checkbox,
    Toast,
    ConfirmDialog,
    Rating,
    Tag,
    IconField,
    InputIcon,
    Card,
    Message
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly titulo = signal('Watchlist de Filmes');

  protected readonly filmes = signal<Filme[]>([
    { id: 1, titulo: 'O Senhor dos Anéis: A Sociedade do Anel', nota: 10, assistido: true },
    { id: 2, titulo: 'Duna: Parte Dois', nota: 9, assistido: true },
    { id: 3, titulo: 'Oppenheimer', nota: 8, assistido: false },
    { id: 4, titulo: 'Interestelar', nota: 10, assistido: true }
  ]);

  protected readonly termoBusca = signal('');

  protected readonly dialogVisivel = signal(false);
  protected readonly modoDialog = signal<ModoDialog>('incluir');

  protected readonly filmeModel = signal<Filme>(novoFilmeVazio());

  protected readonly filmeForm = form(this.filmeModel, (f) => {
    disabled(f, () => this.modoDialog() === 'detalhar');
    required(f.titulo, { message: 'O título é obrigatório.' });
    minLength(f.titulo, 2, { message: 'O título deve ter no mínimo 2 caracteres.' });
    maxLength(f.titulo, 100, { message: 'O título deve ter no máximo 100 caracteres.' });
    min(f.nota, 0, { message: 'A nota mínima é 0.' });
    max(f.nota, 10, { message: 'A nota máxima é 10.' });
  });

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

  protected readonly tituloDialog = computed(() => {
    switch (this.modoDialog()) {
      case 'incluir':
        return 'Novo filme';
      case 'alterar':
        return 'Alterar filme';
      case 'detalhar':
        return 'Detalhes do filme';
    }
  });

  protected readonly somenteLeitura = computed(() => this.modoDialog() === 'detalhar');

  abrirIncluir(): void {
    this.modoDialog.set('incluir');
    this.filmeModel.set(novoFilmeVazio());
    this.dialogVisivel.set(true);
  }

  abrirAlterar(filme: Filme): void {
    this.modoDialog.set('alterar');
    this.filmeModel.set({ ...filme });
    this.dialogVisivel.set(true);
  }

  abrirDetalhar(filme: Filme): void {
    this.modoDialog.set('detalhar');
    this.filmeModel.set({ ...filme });
    this.dialogVisivel.set(true);
  }

  confirmarRemocao(filme: Filme): void {
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

  salvar(): void {
    if (!this.filmeForm().valid()) {
      return;
    }

    const filme = this.filmeModel();

    if (this.modoDialog() === 'incluir') {
      const novo: Filme = { ...filme, id: this.proximoId() };
      this.filmes.update((lista) => [...lista, novo]);
      this.messageService.add({
        severity: 'success',
        summary: 'Filme incluído',
        detail: `"${novo.titulo}" foi adicionado à watchlist.`
      });
    } else if (this.modoDialog() === 'alterar') {
      this.filmes.update((lista) =>
        lista.map((f) => (f.id === filme.id ? { ...filme } : f))
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Filme alterado',
        detail: `As alterações em "${filme.titulo}" foram salvas.`
      });
    }

    this.dialogVisivel.set(false);
  }

  fechar(): void {
    this.dialogVisivel.set(false);
  }

  private remover(filme: Filme): void {
    this.filmes.update((lista) => lista.filter((f) => f.id !== filme.id));
    this.messageService.add({
      severity: 'info',
      summary: 'Filme removido',
      detail: `"${filme.titulo}" foi removido da watchlist.`
    });
  }

  private proximoId(): number {
    const ids = this.filmes().map((f) => f.id);
    return ids.length === 0 ? 1 : Math.max(...ids) + 1;
  }
}
