import { Time } from '@angular/common';

export interface Recette {
    id: number,
    titre: string,
    photo: string,

    chaud: boolean,
    sucre: boolean,
    tempsPreparation: Time,
    tempsCuisson: Time,
    temperatureCuisson: number,

    instructions: string,

    ingredients: {id: number, nom: string, unite: string, quantite: number}[],
    ustensiles: {id: number, nom: string}[],

    id_user: number
}
