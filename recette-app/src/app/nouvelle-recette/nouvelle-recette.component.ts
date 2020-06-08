import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { RecetteService } from '../_services/recette.service';
import { ToasterService } from '../_services/toaster.service';

@Component({
  selector: 'app-nouvelle-recette',
  templateUrl: './nouvelle-recette.component.html',
  styleUrls: ['./nouvelle-recette.component.scss']
})
export class NouvelleRecetteComponent implements OnInit {

  recetteForm: FormGroup = this.fb.group({
    // titre: ['', Validators.required, Validators.minLength(3)],
    titre: ['', Validators.required],
    photo: '',

    chaud: [null, Validators.required],
    sucre: [null, Validators.required],
    tempsPreparation: ['', Validators.required],
    tempsCuisson: [''],
    temperatureCuisson: [null],

    ingredients: this.fb.array([
      this.createItemIngredient()
    ]),

    ustensiles: this.fb.array([
      this.fb.control(null, Validators.required)
    ]),

    etapes: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(10)])
    ]),
  });

  apercuPhoto: string;
  formData = new FormData();

  listeIngredients: { id: number, nom: string, unite: string }[];
  listeUstensiles: { id: number, nom: string }[];


  constructor(
    public fb: FormBuilder,
    public recetteService: RecetteService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.getIngrUst();
  }

  getIngrUst(): void {
    this.recetteService.getIngrUst().subscribe(liste => {
      this.listeIngredients = liste.ingredients;
      this.listeUstensiles = liste.ustensiles;
    })
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
    console.log(this.recetteForm.value);

    this.recetteService.ajouterRecette(this.recetteForm.value).subscribe(response => {
      console.log('Response ajout recette');
      console.log(response);
      this.toasterService.show('success', response.msg);
    });

    this.recetteService.uploadPhoto(this.formData).subscribe(response => {
      console.log('Response upload image');
      console.log(response);
      this.toasterService.show('success', response.msg);
    });
  }
}
