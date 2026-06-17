import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  form,
  FormField,
  max,
  maxLength,
  min,
  minLength,
  required
} from '@angular/forms/signals';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Rating } from 'primeng/rating';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { Filme } from '../filme.model';
import { FilmeService } from '../filme.service';
import { novoFilmeVazio } from '../filme.utils';

@Component({
  selector: 'app-filme-insert',
  imports: [
    FormsModule,
    FormField,
    Card,
    Button,
    InputText,
    InputNumber,
    Checkbox,
    Rating,
    Message
  ],
  templateUrl: './filme-insert.html'
})
export class FilmeInsertComponent {
  private readonly filmeService = inject(FilmeService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  protected readonly filmeModel = signal<Filme>(novoFilmeVazio());

  protected readonly filmeForm = form(this.filmeModel, (f) => {
    required(f.titulo, { message: 'O título é obrigatório.' });
    minLength(f.titulo, 2, { message: 'O título deve ter no mínimo 2 caracteres.' });
    maxLength(f.titulo, 100, { message: 'O título deve ter no máximo 100 caracteres.' });
    min(f.nota, 0, { message: 'A nota mínima é 0.' });
    max(f.nota, 10, { message: 'A nota máxima é 10.' });
  });

  protected salvar(): void {
    if (!this.filmeForm().valid()) return;

    const { id, ...payload } = this.filmeModel();
    this.filmeService
      .inserir(payload)
      .pipe(
        catchError(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao incluir',
            detail: 'Não foi possível incluir o filme no servidor.'
          });
          return of();
        }),
        tap((novo) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Filme incluído',
            detail: `"${novo.titulo}" foi adicionado à watchlist.`
          });
          this.voltarParaLista();
        })
      )
      .subscribe();
  }

  protected voltarParaLista(): void {
    this.router.navigate(['/filmes/listar']);
  }
}
