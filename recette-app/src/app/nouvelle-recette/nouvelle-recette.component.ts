import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecetteService } from '../_services/recette.service';
import { ToasterService } from '../_services/toaster.service';
import { TokenStorageService } from '../_services/token-storage.service'
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recette } from '../share/recette';
import { Time } from '@angular/common';

@Component({
  selector: 'app-nouvelle-recette',
  templateUrl: './nouvelle-recette.component.html',
  styleUrls: ['./nouvelle-recette.component.scss']
})
export class NouvelleRecetteComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  @Input() recetteEdit;
  @Output() eventAnnuler = new EventEmitter<void>();


  apercuPhoto: string;
  formData = new FormData();

  listeIngredients: { id: number, nom: string, unite: string }[];
  listeUstensiles: { id: number, nom: string }[];


  recetteForm: FormGroup = this.fb.group({
    id_user: this.tokenStorage.getUser().id,
    titre: ['', [Validators.required, Validators.minLength(3)]],
    photo: '',

    chaud: [null, Validators.required],
    sucre: [null, Validators.required],
    tempsPreparation: ['', Validators.required],
    tempsCuisson: [''],
    temperatureCuisson: [null],

    ingredients: this.fb.array([
      this.createItemIngredient()
    ], Validators.required),

    ustensiles: this.fb.array([
      this.fb.control(null, Validators.required)
    ], Validators.required),

    etapes: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(10)])
    ], Validators.required),

  });

  constructor(
    public fb: FormBuilder,
    public recetteService: RecetteService,
    private toasterService: ToasterService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getIngrUst();
    if (this.recetteEdit) {
      this.remplirForm();
    }
  }


  getIngrUst(): void {
    this.subscription.add(this.recetteService.getIngrUst().subscribe(liste => {
      this.listeIngredients = liste.ingredients;
      this.listeUstensiles = liste.ustensiles;
    }))
  }




  annulerEdit(): void {
    this.eventAnnuler.emit();
  }

  //Rempli le formulaire avec la recette qui est passé en input
  remplirForm(): void {
    this.recetteForm.addControl('id', this.fb.control(this.recetteEdit.id))

    this.recetteForm.patchValue({
      id_user: this.recetteEdit.id_user,
      titre: this.recetteEdit.titre,
      photo: this.recetteEdit.photo,

      chaud: this.recetteEdit.chaud.toString(),
      sucre: this.recetteEdit.sucre.toString(),
      tempsPreparation: this.formatTime(this.recetteEdit.tempsPreparation),
      tempsCuisson: this.formatTime(this.recetteEdit.tempsCuisson),
      temperatureCuisson: this.recetteEdit.temperatureCuisson,
    })

    this.apercuPhoto = environment.cheminImage + this.recetteEdit.photo;

    this.ingredients.clear();
    for (let i = 0; i < this.recetteEdit.ingredients.length; i++) {
      this.addIngredient();
      this.ingredients.at(i).patchValue(this.recetteEdit.ingredients[i]);
    }
    this.ustensiles.clear();
    for (let i = 0; i < this.recetteEdit.ustensiles.length; i++) {
      this.addUstensiles();
      this.ustensiles.at(i).patchValue(this.recetteEdit.ustensiles[i].id);
    }

    let etapes = this.recetteEdit.instructions.replaceAll('<br>', '');
    etapes = etapes.split(/<h[0-9]>Etape [0-9]*<\/h[0-9]>/);
    etapes.shift();

    this.supprEtape(0);
    for (let i = 0; i < etapes.length; i++) {
      this.addEtape();
      this.etapes.at(i).patchValue(etapes[i]);
    }
  }

  formatTime(time: Time): string {
    //Formate l'heure pour les input type time
    let res = (time.hours < 10) ? '0' + time.hours.toString() : time.hours.toString();
    res += ':';
    res += (time.minutes < 10) ? '0' + time.minutes.toString() : time.minutes.toString();

    return res;
  }






  //Ingrédients
  get ingredients() {
    return this.recetteForm.get('ingredients') as FormArray;
  }
  createItemIngredient(): FormGroup {
    return this.fb.group({
      id: [null, Validators.required],
      quantite: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      unite: ''
    })
  }
  addIngredient(): void {
    this.ingredients.push(this.createItemIngredient());
  }
  supprIngredient(i: number) {
    this.ingredients.removeAt(i);
    this.ingredients.markAsDirty();
  }
  onIngrSelect(event, i) {
    //Récupère l'unité de mesure de l'ingrédient dans le dataset de select => option et met sa valeur dans le champ unite de l'ingrédient qui à été sélectionné
    this.ingredients.at(i).get('unite').setValue(event.target[event.target.selectedIndex].dataset.unite);
  }


  //Ustensiles
  get ustensiles() {
    return this.recetteForm.get('ustensiles') as FormArray;
  }
  addUstensiles() {
    this.ustensiles.push(this.fb.control(null, Validators.required));
  }
  supprUstensile(i: number) {
    this.ustensiles.removeAt(i);
    this.ustensiles.markAsDirty();
  }


  //Photo
  get photo() {
    return this.recetteForm.get('photo');
  }
  onFileSelect(event) {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.apercuPhoto = e.target.result;
        this.photo.setValue(file.name);

        this.formData.append('file', file);
      }
      reader.readAsDataURL(file);
    }
  }



  //Etapes
  get etapes() {
    return this.recetteForm.get('etapes') as FormArray;
  }
  addEtape(): void {
    this.etapes.push(this.fb.control('', [Validators.required, Validators.minLength(10)]));
  }
  supprEtape(i: number): void {
    this.etapes.removeAt(i);
  }



  onSubmit(): void {
    //Modification reccette
    if (this.recetteEdit) {
      //Remplace liste par 'pristine' pour indiquer absence de modification
      if (this.ingredients.pristine) this.recetteForm.setControl('ingredients', this.fb.control('pristine'));
      if (this.ustensiles.pristine) this.recetteForm.setControl('ustensiles', this.fb.control('pristine'));

      //Photo changée
      if (this.recetteEdit.photo != this.recetteForm.get('photo').value) {
        //Si photo précédente non celle par defaut -> suppression
        if (!(this.recetteEdit.photo == 'spaguetti.png' || this.recetteEdit.photo == 'cake.png')) {
          this.subscription.add(this.recetteService.supprPhoto({ nom: this.recetteEdit.photo, id: this.recetteEdit.id }).subscribe(response => {
            this.toasterService.show('success', response.msg);
          }));
        }
        //Upload photo
        this.subscription.add(this.recetteService.uploadPhoto(this.formData).subscribe(response => {
          this.toasterService.show('success', response.msg);
        }));
      }

      //Modif recette
      this.subscription.add(this.recetteService.modifierRecette(this.recetteForm.value).subscribe(response => {
        this.toasterService.show('success', response.msg);
        window.location.assign(environment.siteUrl + 'recette/' + this.recetteForm.get('titre').value);
        window.location.reload();
      }));
    }
    //Création recette
    else {
      //Recette
      this.subscription.add(this.recetteService.ajouterRecette(this.recetteForm.value).subscribe(response => {
        this.toasterService.show('success', response.msg);
      }));

      //Photo
      if (this.recetteForm.get('photo').value != '') {
        this.subscription.add(this.recetteService.uploadPhoto(this.formData).subscribe(response => {
          this.toasterService.show('success', response.msg);
        }));
      }
    }
  }



  supprimerRecette(): void {
    //Si photo précédente non celle par defaut -> suppression
    if (!(this.recetteEdit.photo == 'spaguetti.png' || this.recetteEdit.photo == 'cake.png')) {
      this.subscription.add(this.recetteService.supprPhoto({ nom: this.recetteEdit.photo, id: this.recetteEdit.id }).subscribe(response => {
        this.toasterService.show('success', response.msg);
      }));
    }

    this.subscription.add(this.recetteService.supprRecette(this.recetteEdit).subscribe(response => {
      this.toasterService.show('success', response.msg);
      window.location.assign(environment.siteUrl);
      window.location.reload();
    }));
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
