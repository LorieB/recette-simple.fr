import { Component, OnInit } from '@angular/core';

import { Recette } from '../share/recette';
import { RecetteService } from '../_services/recette.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  
  private subscription: Subscription

  listeRecettes = new Array<Recette>();

  constructor(
    private recetteService : RecetteService
    ) { }

  ngOnInit(): void {
    this.getRecettes();
  }


  getRecettes(): void {
    this.subscription = this.recetteService.getRecettes().subscribe(recettes => {
      this.listeRecettes = recettes;
    });
  }


  filtrerRecette(filtre): Recette[] {
    return this.listeRecettes.filter(recette => {
      if (filtre == 'sucre'){
        return recette.sucre;
      }
      else if (filtre == 'sale'){
        return !recette.sucre;
      }
    });
  }


  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
