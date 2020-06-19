const sql = require("../models/db.js");


exports.recherche = (req, res) => {

    requette = `SELECT DISTINCT titre, photo, tempsPreparation, tempsCuisson `+
    `FROM recette ` +
    `INNER JOIN ingr_recette ON recette.id = ingr_recette.id_recette ` +
    `INNER JOIN ingredient ON ingr_recette.id_ingredient = ingredient.id ` +
    `INNER JOIN ust_recette ON recette.id = ust_recette.id_recette ` +
    `INNER JOIN ustensile ON ust_recette.id_ustensile = ustensile.id ` +
    `WHERE `;
    if(req.body.nom != ""){
        requette += `titre LIKE '%${req.body.nom}%' OR ingredient.nom LIKE '%${req.body.nom}%' `+
        `AND `;
    }
    if(req.body.categorie.chaud){
        requette += `recette.chaud = ${req.body.categorie.chaud} `+
        `AND `;
    }
    if(req.body.categorie.sucre){
        requette += `recette.sucre = ${req.body.categorie.sucre} `+
        `AND `;
    }
    if(req.body.temps.tempsTotal){
        requette += `ADDTIME(recette.tempsPreparation, recette.tempsCuisson) <= '${req.body.temps.tempsTotal}' `+
        `AND `;
    }
    if(req.body.temps.tempsCuisson != ""){
        requette += `recette.tempsCuisson <= '${req.body.temps.tempsCuisson}' `+
        `AND `;
    }
    if(req.body.temps.tempsPreparation != ""){
        requette += `recette.tempsPreparation <= '${req.body.temps.tempsPreparation}' `+
        `AND `;
    }

    requette = requette.slice(0, requette.length -4); //Suppr 'AND '
    

    sql.query(requette, (err, rows) => {
        if (err) throw err;    
        
        for(row of rows){
            tmp = row.tempsPreparation.split(':');
            row.tempsPreparation = { hours: +tmp[0], minutes: +tmp[1] };
      
            if (row.tempsCuisson) {
              tmp = row.tempsCuisson.split(':');
              row.tempsCuisson = { hours: +tmp[0], minutes: +tmp[1] };
            }
        }

        res.status(200).send(rows);
    })

}