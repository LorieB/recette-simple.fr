import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RechercheService } from '../_services/recherche.service';
import { Recette } from '../share/recette';
import { Subscription } from 'rxjs/internal/Subscription';
import { ToasterService } from '../_services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.scss']
})
export class RechercheComponent implements OnInit {

  private subscription: Subscription = new Subscription();

  cheminImage = environment.cheminImage;

  formRecherche: FormGroup = this.fb.group({
    nom: "",
    categorie: this.fb.group({
      sucre: null,
      chaud: null
    }),
    temps: this.fb.group({
      tempsTotal: "",
      tempsPreparation: "",
      tempsCuisson: ""
    })
  })

  recettes = new Array<Recette>();

  constructor(
    private rechercheService: RechercheService,
    private fb: FormBuilder,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('recherche')){
      this.recettes = JSON.parse(sessionStorage.getItem('recherche'));
    }
  }



  get categorie() {
    return this.formRecherche.get('categorie') as FormGroup;
  }

  get temps() {
    return this.formRecherche.get('temps') as FormGroup;
  }

  deselect(event) {
    //Déselectionne le bouton radion au second click
    if (event.target.value == this.formRecherche.get('categorie').get(event.target.name).value) {
      event.target.checked = false;
      this.categorie.controls[event.target.name].reset();
    }
  }


  avanceVide(): boolean {
    //Si form pristine ou temps total, préparation et cuisson vide (radio bouton redevienne pristine à la déselection)
    if (this.categorie.pristine && (this.temps.pristine || (this.temps.get('tempsTotal').value == "" && this.temps.get('tempsPreparation').value == "" && this.temps.get('tempsCuisson').value == ""))) {
      return true;
    } else {
      return false;
    }
  }

  recherche(): void {
    if (!this.avanceVide() || this.formRecherche.get('nom').value != "") {
      this.subscription.add(this.rechercheService.rechercheAvance(this.formRecherche.value).subscribe(resultat => {
        this.recettes = resultat;
        sessionStorage.setItem('recherche', JSON.stringify(resultat));
        if (resultat.length == 0) {
          this.toasterService.show('info', "Aucun résultat n'a été trouvé");
        }
      }));
    } else {
      this.toasterService.show('warning', "Merci de renseigner au moins un critère de recherche");
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}