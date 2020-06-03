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
    // etapes: string[],

    ingredients: {nom: string, unite: string, quantite: number}[],
    ustensiles: string[]
}
// export class Recette {
//     id: number;
//     titre: string;
//     photo: string;

//     chaud: boolean;
//     sucre: boolean;
//     tempsPreparation: Time;
//     tempsCuisson: Time;
//     temperatureCuisson: number;

//     instructions: string;
//     etapes: string[];

//     ingredients: {nom: string, unite: string, quantite: number}[];
//     ustensiles: string[];
// }