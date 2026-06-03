import { Component, inject, signal } from '@angular/core';

import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { Filme } from './filme.model';
import { FilmeListComponent } from './filme-list/filme-list';
import { FilmeDetailComponent } from './filme-detail/filme-detail';
import { FilmeInsertComponent } from './filme-insert/filme-insert';
import { FilmeUpdateComponent } from './filme-update/filme-update';

const FILME_VAZIO: Filme = { id: 0, titulo: '', nota: 0, assistido: false };

@Component({
  selector: 'app-root',
  imports: [
    Toast,
    ConfirmDialog,
    FilmeListComponent,
    FilmeDetailComponent,
    FilmeInsertComponent,
    FilmeUpdateComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  protected readonly filmes = signal<Filme[]>([
    { id: 1, titulo: 'O Senhor dos Anéis: A Sociedade do Anel', nota: 10, assistido: true },
    { id: 2, titulo: 'Duna: Parte Dois', nota: 9, assistido: true },
    { id: 3, titulo: 'Oppenheimer', nota: 8, assistido: false },
    { id: 4, titulo: 'Interestelar', nota: 10, assistido: true }
  ]);

  protected readonly filmeSelecionado = signal<Filme>(FILME_VAZIO);

  protected readonly dialogIncluirVisivel = signal(false);
  protected readonly dialogAlterarVisivel = signal(false);
  protected readonly dialogDetalharVisivel = signal(false);

  protected onIncluir(): void {
    this.dialogIncluirVisivel.set(true);
  }

  protected onDetalhar(filme: Filme): void {
    this.filmeSelecionado.set(filme);
    this.dialogDetalharVisivel.set(true);
  }

  protected onAlterar(filme: Filme): void {
    this.filmeSelecionado.set(filme);
    this.dialogAlterarVisivel.set(true);
  }

  protected onRemover(filme: Filme): void {
    this.confirmationService.confirm({
      header: 'Remover filme',
      message: `Tem certeza que deseja remover "${filme.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remover',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.removerFilme(filme)
    });
  }

  protected onFilmeIncluido(filme: Filme): void {
    const novo: Filme = { ...filme, id: this.proximoId() };
    this.filmes.update((lista) => [...lista, novo]);
    this.messageService.add({
      severity: 'success',
      summary: 'Filme incluído',
      detail: `"${novo.titulo}" foi adicionado à watchlist.`
    });
  }

  protected onFilmeAlterado(filme: Filme): void {
    this.filmes.update((lista) =>
      lista.map((f) => (f.id === filme.id ? { ...filme } : f))
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Filme alterado',
      detail: `As alterações em "${filme.titulo}" foram salvas.`
    });
  }

  private removerFilme(filme: Filme): void {
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
