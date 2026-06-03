import { Component, input, model } from '@angular/core';

import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

import { Filme } from '../filme.model';

@Component({
  selector: 'app-filme-detail',
  imports: [FormsModule, Dialog, Button, Rating, Tag],
  templateUrl: './filme-detail.html'
})
export class FilmeDetailComponent {
  readonly visivel = model.required<boolean>();
  readonly filme = input.required<Filme>();

  protected fechar(): void {
    this.visivel.set(false);
  }
}
