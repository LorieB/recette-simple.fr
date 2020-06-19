import { Injectable } from '@angular/core';
import { Observable , of } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

import { ToasterService } from '../_services/toaster.service';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RechercheService {

  constructor(
    private http : HttpClient,
    private toasterService: ToasterService
  ) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      console.error(error); 
      this.toasterService.show('danger', error.message);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  rechercheAvance(option: any): Observable<any> {
    return this.http.post<any>(environment.serverUrl+'recherche', option)
    .pipe(
      catchError(this.handleError<any>('recherche'))
    );
  }
}
