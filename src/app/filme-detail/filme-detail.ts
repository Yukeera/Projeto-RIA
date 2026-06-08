import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';

import { Filme } from '../filme.model';
import { filmeFromHistory } from '../filme.utils';

@Component({
  selector: 'app-filme-detail',
  imports: [FormsModule, Card, Button, Rating, Tag],
  templateUrl: './filme-detail.html'
})
export class FilmeDetailComponent {
  private readonly router = inject(Router);

  protected readonly filme: Filme = filmeFromHistory();

  protected voltarParaLista(): void {
    this.router.navigate(['/filmes/listar']);
  }

  protected irParaAlteracao(): void {
    this.router.navigate(['/filmes/editar'], { state: { filme: this.filme } });
  }
}
