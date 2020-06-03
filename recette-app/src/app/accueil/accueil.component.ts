import { Component, OnInit } from '@angular/core';

import { Recette } from '../share/recette';
import { RecetteService } from '../_services/recette.service';
// import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  listeRecettes: Recette[];

  constructor(
    private recetteService : RecetteService
    ) { }

  ngOnInit(): void {
    this.getRecettes();
  }


  // getRecettes(): void {
  //   this.listeRecettes = this.recetteService.getRecettes();
  //   console.log(this.listeRecettes);
  // }
  getRecettes(): void {
    this.recetteService.getRecettes().subscribe(recettes => {
      console.log(recettes);
      this.listeRecettes = recettes;
    });
  }

  // ngOnDestroy() {
  //   // prevent memory leak when component destroyed
  //   this.subscription.unsubscribe();
  // }

}
