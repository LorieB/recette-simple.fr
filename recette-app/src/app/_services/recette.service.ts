import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Recette } from '../share/recette';

import { ToasterService } from '../_services/toaster.service';

import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecetteService {

  constructor(
    private http : HttpClient,
    private toasterService: ToasterService
  ) { }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.toasterService.show('danger', error.error);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getRecettes(): Observable<Recette[]> {
    return this.http.get<Recette[]>(environment.serverUrl+'recettes')
    .pipe(
      catchError(this.handleError<Recette[]>('getRecettes', []))
    );
  }

  getRecette(titreR: string): Observable<Recette> {
    return this.http.get<Recette>(environment.serverUrl+'recette/'+titreR)
    .pipe(
      catchError(this.handleError<Recette>('getRecette'))
    );
  }

  getIngrUst(): Observable<any>{
    return this.http.get<any>(environment.serverUrl+'IngrUst')
    .pipe(
      catchError(this.handleError<any>('getIngrUst'))
    );
  }

  ajouterRecette(recette: Recette): Observable<any> {
    return this.http.post<Recette>(environment.serverUrl+'ajout-recette', recette)
    .pipe(
      catchError(this.handleError<Recette>('ajouterRecette'))
    );
  }

  modifierRecette(recette: Recette): Observable<any> {
    return this.http.post<Recette>(environment.serverUrl+'modifier-recette', recette)
    .pipe(
      catchError(this.handleError<any>('modifierRecette'))
    );
  }

  supprRecette(recette: Recette): Observable<any> {
    return this.http.post<Recette>(environment.serverUrl+'suppr-recette', recette)
    .pipe(
      catchError(this.handleError<any>('supprRecette'))
    );
  }

  uploadPhoto(data: FormData): Observable<any> {
    return this.http.post<FormData>(environment.serverUrl+'upload', data)
    .pipe(
      catchError(this.handleError<FormData>('uploadPhoto'))
    );
  }

  supprPhoto(data: {nom: string, id: number}): Observable<any> {
    return this.http.post<any>(environment.serverUrl+'suppr-photo', data)
    .pipe(
      catchError(this.handleError<string>('supprPhoto'))
    );
  }

  ajoutIngredient(ingredients: [{nom: string, unite: string}]): Observable<any> {
    return this.http.post<[{nom: string, unite: string}]>(environment.serverUrl+'ajout-ingredient', ingredients)
    .pipe(
      catchError(this.handleError<[{nom: string, unite: string}]>('ajoutIngredient'))
    );
  }

  ajoutUstensile(ustensiles: [{nom: string}]): Observable<any> {
    return this.http.post<[{nom: string}]>(environment.serverUrl+'ajout-ustensile', ustensiles)
    .pipe(
      catchError(this.handleError<[{nom: string}]>('ajoutUstensile'))
    );
  }

}
