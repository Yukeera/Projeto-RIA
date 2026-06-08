import { Routes } from '@angular/router';

import { FilmeListComponent } from './filme-list/filme-list';
import { FilmeInsertComponent } from './filme-insert/filme-insert';
import { FilmeUpdateComponent } from './filme-update/filme-update';
import { FilmeDetailComponent } from './filme-detail/filme-detail';

export const routes: Routes = [
  {
    path: 'filmes',
    children: [
      { path: 'listar', component: FilmeListComponent },
      { path: 'incluir', component: FilmeInsertComponent },
      { path: 'editar', component: FilmeUpdateComponent },
      { path: 'detalhar', component: FilmeDetailComponent },
      { path: '', redirectTo: 'listar', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'filmes/listar', pathMatch: 'full' },
  { path: '**', redirectTo: 'filmes/listar' }
];
