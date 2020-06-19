import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccueilComponent } from './accueil/accueil.component';
import { AstuceComponent } from './astuce/astuce.component';
import { NouvelleRecetteComponent } from './nouvelle-recette/nouvelle-recette.component';
import { RecetteComponent } from './recette/recette.component';
import { LoginComponent } from './login/login.component';
import { RechercheComponent } from './recherche/recherche.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full'},
  { path: 'accueil', component: AccueilComponent },
  { path: 'astuce', component: AstuceComponent },
  { path: 'nouvelleRecette', component: NouvelleRecetteComponent, canActivate: [AuthGuard] },
  { path: 'login', component:LoginComponent },
  { path: 'recherche', component:RechercheComponent },
  { path: 'recette/:titre', component: RecetteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
