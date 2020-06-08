import { Injectable } from '@angular/core';
import { Toast } from '../_toaster/toast.interface';
import { ToastType } from '../_toaster/toast.type';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  subject: BehaviorSubject<Toast>;
  toast$: Observable<Toast>;

  constructor() {
    this.subject = new BehaviorSubject<Toast>(null);
    this.toast$ = this.subject.asObservable()
      .pipe(filter(toast => toast !== null));
  }

  show(type: ToastType, body?: string, delay?: number) {
    this.subject.next({ type, body, delay });
  }
}