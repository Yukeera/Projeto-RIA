import { Component, computed, inject, input, model } from '@angular/core';

import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

import { FilmeService } from '../filme.service';

@Component({
  selector: 'app-filme-detail',
  imports: [FormsModule, Dialog, Button, Rating, Tag],
  templateUrl: './filme-detail.html'
})
export class FilmeDetailComponent {
  private readonly filmeService = inject(FilmeService);

  readonly visivel = model.required<boolean>();
  readonly filmeId = input.required<number>();

  protected readonly filme = computed(() => this.filmeService.buscarPorId(this.filmeId()));

  protected fechar(): void {
    this.visivel.set(false);
  }
}
