import { Component, effect, input, model, output, signal } from '@angular/core';
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

import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import { Rating } from 'primeng/rating';
import { Message } from 'primeng/message';

import { Filme } from '../filme.model';

@Component({
  selector: 'app-filme-update',
  imports: [
    FormsModule,
    FormField,
    Dialog,
    Button,
    InputText,
    InputNumber,
    Checkbox,
    Rating,
    Message
  ],
  templateUrl: './filme-update.html'
})
export class FilmeUpdateComponent {
  readonly visivel = model.required<boolean>();
  readonly filme = input.required<Filme>();
  readonly salvo = output<Filme>();

  protected readonly filmeModel = signal<Filme>({
    id: 0,
    titulo: '',
    nota: 0,
    assistido: false
  });

  protected readonly filmeForm = form(this.filmeModel, (f) => {
    required(f.titulo, { message: 'O título é obrigatório.' });
    minLength(f.titulo, 2, { message: 'O título deve ter no mínimo 2 caracteres.' });
    maxLength(f.titulo, 100, { message: 'O título deve ter no máximo 100 caracteres.' });
    min(f.nota, 0, { message: 'A nota mínima é 0.' });
    max(f.nota, 10, { message: 'A nota máxima é 10.' });
  });

  private readonly syncOnOpen = effect(() => {
    if (this.visivel()) {
      this.filmeForm().reset({ ...this.filme() });
    }
  });

  protected salvar(): void {
    if (!this.filmeForm().valid()) return;
    this.salvo.emit({ ...this.filmeModel() });
    this.visivel.set(false);
  }

  protected fechar(): void {
    this.visivel.set(false);
  }
}
