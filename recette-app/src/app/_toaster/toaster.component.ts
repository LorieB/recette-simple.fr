import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Toast } from './toast.interface';

@Component({
    selector: 'app-toaster',
    template: `
    <div class="alert alert-{{toast.type}} alert-dismissible fade show">
      {{toast.body}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close" (click)="remove.emit(i)" >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `
})
export class ToasterComponent {
    @Input() toast: Toast;
    @Input() i: number;

    @Output() remove = new EventEmitter<number>();
}