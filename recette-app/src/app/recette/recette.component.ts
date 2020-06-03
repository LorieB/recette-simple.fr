import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 
import { Recette } from '../share/recette';
import { RecetteService } from '../_services/recette.service';

import { environment } from '../../environments/environment'

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.scss']
})
export class RecetteComponent implements OnInit {

  // recette: Recette;
  recette: Recette = {
    id: null, 
    titre: null, 
    photo: null, 
    chaud: null, 
    sucre: null, 
    tempsPreparation: {hours: null, minutes: null}, 
    tempsCuisson: {hours: null, minutes: null}, 
    temperatureCuisson: null, 
    instructions: null, 
    // etapes: [], 
    ingredients: [], 
    ustensiles: []
  };

  cheminImage = environment.cheminImage;

  constructor(
    private recetteService: RecetteService,
    private route: ActivatedRoute,
    // private router: Router
  ) { }

  ngOnInit(): void {
    this.getRecette();
  }

  getRecette(): void {
    const titre = this.route.snapshot.paramMap.get('titre');
    this.recetteService.getRecette(titre).subscribe(recette => {
      console.log(recette);
      this.recette = recette;
    });
  }

}
