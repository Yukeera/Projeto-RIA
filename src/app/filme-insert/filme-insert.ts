import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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

    const novo = this.filmeService.inserir(this.filmeModel());
    this.messageService.add({
      severity: 'success',
      summary: 'Filme incluído',
      detail: `"${novo.titulo}" foi adicionado à watchlist.`
    });
    this.voltarParaLista();
  }

  protected voltarParaLista(): void {
    this.router.navigate(['/filmes/listar']);
  }
}
