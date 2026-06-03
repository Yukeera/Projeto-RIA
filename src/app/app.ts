import { Component, signal } from '@angular/core';

import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { Filme } from './filme.model';
import { FilmeListComponent } from './filme-list/filme-list';
import { FilmeDetailComponent } from './filme-detail/filme-detail';
import { FilmeInsertComponent } from './filme-insert/filme-insert';
import { FilmeUpdateComponent } from './filme-update/filme-update';

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
  protected readonly filmeSelecionadoId = signal(0);

  protected readonly dialogIncluirVisivel = signal(false);
  protected readonly dialogAlterarVisivel = signal(false);
  protected readonly dialogDetalharVisivel = signal(false);

  protected onIncluir(): void {
    this.dialogIncluirVisivel.set(true);
  }

  protected onDetalhar(filme: Filme): void {
    this.filmeSelecionadoId.set(filme.id);
    this.dialogDetalharVisivel.set(true);
  }

  protected onAlterar(filme: Filme): void {
    this.filmeSelecionadoId.set(filme.id);
    this.dialogAlterarVisivel.set(true);
  }
}
