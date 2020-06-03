import { Recette } from './recette';

export const RECETTE: Recette[] = [
    {
        id: 1,
        titre: 'Gateau',
        photo: '../assets/spaguetti.png',
    
        chaud: false,
        sucre: true,
        tempsPreparation: {hours:1, minutes:0},
        tempsCuisson: {hours:0, minutes:25},
        temperatureCuisson: 180,
    
        instructions: '<h3>Etape 1</h3>casser les oeufs<br><br><h3>Etape 2</h3>Manger les oeufs<br><br><h3>Etape 3</h3>Le reste sert a rien',
        // etapes: [],
    
        ingredients: [
            {nom: 'farine', unite: 'g', quantite: 50}, 
            {nom: 'chocolat', unite: 'g', quantite: 200}, 
            {nom: 'beurre', unite: 'g', quantite: 100},
            {nom: 'sucre', unite: 'g', quantite: 100}
        ],
        ustensiles: [
            'saladier',
            'fourchette',
            'four'
        ]
    },
    {
        id: 2,
        titre: 'Plat',
        photo: '../assets/spaguetti.png',
    
        chaud: true,
        sucre: false,
        tempsPreparation: {hours:0, minutes:15},
        tempsCuisson: {hours:0, minutes:5},
        temperatureCuisson: null,
    
        instructions: 'Faire le plat',
        // etapes: [],
    
        ingredients: [
            {nom: 'courgette', unite: '', quantite: 1}, 
            {nom: 'sauce tomate', unite: 'cl', quantite: 20}, 
            {nom: 'riz', unite: 'g', quantite: 100}
        ],
        ustensiles: [
            'poêle',
            'couteau'
        ]
    }
]