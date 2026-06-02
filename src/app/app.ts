import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

import { Filme } from './filme.model';

type ModoDialog = 'incluir' | 'alterar' | 'detalhar';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
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
    Card
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
  protected readonly filmeEditavel = signal<Filme>(this.novoFilmeVazio());

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
    this.filmeEditavel.set(this.novoFilmeVazio());
    this.dialogVisivel.set(true);
  }

  abrirAlterar(filme: Filme): void {
    this.modoDialog.set('alterar');
    this.filmeEditavel.set({ ...filme });
    this.dialogVisivel.set(true);
  }

  abrirDetalhar(filme: Filme): void {
    this.modoDialog.set('detalhar');
    this.filmeEditavel.set({ ...filme });
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
    const filme = this.filmeEditavel();

    if (!filme.titulo.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo obrigatório',
        detail: 'Informe o título do filme.'
      });
      return;
    }

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

  private novoFilmeVazio(): Filme {
    return { id: 0, titulo: '', nota: 0, assistido: false };
  }

  protected atualizarCampo<K extends keyof Filme>(campo: K, valor: Filme[K]): void {
    this.filmeEditavel.update((f) => ({ ...f, [campo]: valor }));
  }
}
