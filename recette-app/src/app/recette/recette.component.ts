import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Recette } from '../share/recette';
import { RecetteService } from '../_services/recette.service';

import { environment } from '../../environments/environment'
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-recette',
  templateUrl: './recette.component.html',
  styleUrls: ['./recette.component.scss']
})
export class RecetteComponent implements OnInit {

  private subscription: Subscription

  recette: Recette = {
    id: null,
    titre: null,
    photo: null,
    chaud: null,
    sucre: null,
    tempsPreparation: { hours: null, minutes: null },
    tempsCuisson: { hours: null, minutes: null },
    temperatureCuisson: null,
    instructions: null,
    ingredients: [],
    ustensiles: [],
    id_user: null
  };

  cheminImage = environment.cheminImage;

  edition: boolean = false;




  constructor(
    private recetteService: RecetteService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.getRecette();
  }

  getRecette(): void {
    const titre = this.route.snapshot.paramMap.get('titre');
    this.subscription = this.recetteService.getRecette(titre).subscribe(recette => {
      this.recette = recette;
    });
  }

  //Admin peut éditer toutes les recettes
  //User peut éditer ses recettes
  peutEditer(): boolean {
    let edit = false;

    if (!!this.tokenStorage.getToken()) { //est connecté ?
      let roles = this.tokenStorage.getUser().roles;

      if (roles.find(r => r == 'ROLE_ADMIN')) {
        edit = true;
      } else if (roles.find(r => r == 'ROLE_USER') && this.recette.id_user == this.tokenStorage.getUser().id) {
        edit = true;
      }
    }
    return edit;
  }

  editRecette(): void {
    this.edition = !this.edition;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
