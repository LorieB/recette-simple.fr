import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Recette } from '../share/recette';
import { RECETTE } from '../share/mock-recette';

import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RecetteService {

  constructor(
    private http : HttpClient
  ) { }

  recette = RECETTE;

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error('error'); // log to console instead
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // getRecettes(): Recette[] {
  //   return this.recette;
  // }
  getRecettes(): Observable<Recette[]> {
    return this.http.get<Recette[]>(environment.serverUrl+'recettes')
    .pipe(
      catchError(this.handleError<Recette[]>('getRecettes', []))
    );
  }

  // getRecetteOld(titreR: string): Recette {
  //   return this.recette.find( r => r.titre == titreR );
  // }
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

  uploadPhoto(data: FormData): Observable<any> {
    return this.http.post<FormData>(environment.serverUrl+'upload', data)
    .pipe(
      catchError(this.handleError<FormData>('uploadPhoto'))
    );
  }

}
