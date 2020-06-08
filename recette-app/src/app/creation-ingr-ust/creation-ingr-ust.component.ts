import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { RecetteService } from '../_services/recette.service';
import { ToasterService } from '../_services/toaster.service';
import { alreadyExistValidator } from '../_validators/custom.validators';

@Component({
  selector: 'app-creation-ingr-ust',
  templateUrl: './creation-ingr-ust.component.html',
  styleUrls: ['./creation-ingr-ust.component.scss']
})
export class CreationIngrUstComponent implements OnInit {

  @Input() listeIngredients: { id: number, nom: string, unite: string }[];
  @Input() listeUstensiles: { id: number, nom: string }[];

  @Output() ajoutEvent = new EventEmitter<string>();


  newIngredientForm: FormGroup = this.fb.group({
    newIngredients: this.fb.array([])
  })

  newUstensileForm: FormGroup = this.fb.group({
    newUstensiles: this.fb.array([])
  })


  constructor(
    public fb: FormBuilder,
    public recetteService: RecetteService,
    private toasterService: ToasterService,
    private cdRef:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges() {

  }


  //Ingredients
  get newIngredients() {
    return this.newIngredientForm.get('newIngredients') as FormArray;
  }
  createItemIngredient(): FormGroup {
    return this.fb.group({
      nomI: ['', [Validators.required, Validators.minLength(4), alreadyExistValidator(this.listeIngredients)]],
      unite: ''
    })
  }
  addNewIngredient(): void {
    this.newIngredients.push(this.createItemIngredient());
  }
  supprNewIngredient(i: number): void {
    this.newIngredients.removeAt(i);
  }
  supprAllNewIngredient(): void {
    while(this.newIngredients.length > 0){
      this.newIngredients.removeAt(0);
    }
  }

  onSubmitIngredient(): void {    
    this.recetteService.ajoutIngredient(this.newIngredientForm.value).subscribe(response => {
      console.log(response);
      this.supprAllNewIngredient();
      this.ajoutEvent.emit();
      this.toasterService.show('success', response.msg);
    })
  }




  //Ustensiles
  get newUstensiles(){
    return this.newUstensileForm.get('newUstensiles') as FormArray;
  }
  createItemUstensile(): FormGroup {
    return this.fb.group({
      nomU: ['', [Validators.required, Validators.minLength(4), alreadyExistValidator(this.listeUstensiles)]]
    })
  }
  addNewUstensile(): void {
    this.newUstensiles.push(this.createItemUstensile());
  }
  supprNewUstensile(i: number): void {
    this.newUstensiles.removeAt(i);
  }
  supprAllNewUstensile(): void {
    while(this.newUstensiles.length > 0){
      this.newUstensiles.removeAt(0);
    }
  }

  onSubmitUstensile(): void {
    this.recetteService.ajoutUstensile(this.newUstensileForm.value).subscribe(response => {
      console.log(response);
      this.supprAllNewUstensile();
      this.ajoutEvent.emit();
      this.toasterService.show('success', response.msg);
    })
  }
}
