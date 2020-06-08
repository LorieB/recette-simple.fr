import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


export function alreadyExistValidator(liste: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors  | null => {
        let forbidden = -1;
        if (liste) {
            forbidden = liste.findIndex(item => item.nom == control.value);
        }
        return forbidden != -1 ? { 'forbiddenName': { value: control.value } } : null;
    };
}