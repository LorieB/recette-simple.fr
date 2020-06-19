const config = require("../config/auth.config");

const sql = require("../models/db.js");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const fs = require('fs-extra');       //File System - for file manipulation
const pathPh = require("../config/path.config");


//Liste de toutes les recettes
exports.getRecettes = (req, res) => {

  requette = `SELECT * FROM recette `;

  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send(rows);
    });
}


exports.getRecetteByTitre = (req, res) => {

  req.params.titre = req.params.titre.replace(/\\/g, '\\\\');
  req.params.titre = req.params.titre.replace(/'/g, "\\'");

  requette = `SELECT titre, sucre, chaud, tempsPreparation, tempsCuisson, temperatureCuisson, instructions, photo, ` +
    `GROUP_CONCAT(DISTINCT '"nom": "', ingredient.nom, '", ', '"unite": "', ingredient.unite, '", ', '"quantite": ', ingr_recette.quantite SEPARATOR '},{')  AS ingredients, ` + //Mise en forme du résultat pour correspondre à un objet json 
    `GROUP_CONCAT(DISTINCT ustensile.nom) AS ustensiles ` +
    `FROM recette ` +
    `INNER JOIN ingr_recette ON recette.id = ingr_recette.id_recette ` +
    `INNER JOIN ingredient ON ingr_recette.id_ingredient = ingredient.id ` +
    `INNER JOIN ust_recette ON recette.id = ust_recette.id_recette ` +
    `INNER JOIN ustensile ON ust_recette.id_ustensile = ustensile.id ` +
    `WHERE titre = '${req.params.titre}' ; `;

  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      tmp = rows[0].tempsPreparation.split(':');
      rows[0].tempsPreparation = { hours: +tmp[0], minutes: +tmp[1] };

      if (rows[0].tempsCuisson) {
        tmp = rows[0].tempsCuisson.split(':');
        rows[0].tempsCuisson = { hours: +tmp[0], minutes: +tmp[1] };
      }

      rows[0].ingredients = JSON.parse('[{' + rows[0].ingredients + '}]');

      rows[0].ustensiles = rows[0].ustensiles.split(',');

      res.status(200).send(rows[0]);
    })
}


exports.ajouterRecette = (req, res) => {

  //Vérifie la présence d'ingrédients 
  if (req.body.ingredients.length == 0) {
    res.status(400).send('Ingrédients manquant');
  }
  //Vérifie la présence d'ustensiles 
  else if (req.body.ustensiles.length == 0) {
    res.status(400).send('Ustensiles manquant');
  }
  else {
    //Si absence de photo met celle par défaut selon si sucré ou salé
    if(req.body.photo == ''){
      req.body.photo = req.body.sucre ? 'cake.png' : 'spaguetti.png';
    }
    //transforme le tableau d'étapes en une string d'instructions
    instructions = '';
    for (let i = 0; i < req.body.etapes.length; i++) {
      instructions += `<h3>Etape ${i + 1}</h3>${req.body.etapes[i]}<br><br>`;
    }

    //Echappe \ puis '
    req.body.titre = req.body.titre.replace(/\\/g, '\\\\');
    req.body.titre = req.body.titre.replace(/'/g, "\\'");
    instructions = instructions.replace(/\\/g, '\\\\');
    instructions = instructions.replace(/'/g, "\\'");
    //Valeur de temps valide
    if (req.body.tempsCuisson == '') {
      req.body.tempsCuisson = '00:00';
    }


    requette = `INSERT INTO recette (titre, sucre, chaud, tempsPreparation, tempsCuisson, temperatureCuisson, instructions, photo) VALUES ('${req.body.titre}', ${req.body.sucre}, ${req.body.chaud}, '${req.body.tempsPreparation}', '${req.body.tempsCuisson}', ${req.body.temperatureCuisson}, '${instructions}', '${req.body.photo}'); ` +
      `SET @idRecette = LAST_INSERT_ID(); `;

    //Insert ustensiles
    requette += `INSERT INTO ust_recette (id_ustensile, id_recette) VALUES `;
    for (let ust of req.body.ustensiles) {
      requette += `(${ust}, @idRecette),`;
    }
    requette = requette.slice(0, requette.length - 1);
    requette += `; `;

    //Insert ingredients
    `INSERT INTO ingr_recette (id_ingredient, id_recette, quantite) VALUES (1, @idRecette);`;
    requette += `INSERT INTO ingr_recette (id_ingredient, id_recette, quantite) VALUES `;
    for (let ingr of req.body.ingredients) {
      requette += `(${ingr.id}, @idRecette, ${ingr.quantite}),`;
    }
    requette = requette.slice(0, requette.length - 1);
    requette += `; `;


    sql.query(requette,
      (err, rows) => {
        if (err) throw err;

        res.status(200).send({msg: 'recette crée !'});
      });
  }
}

exports.upload = (req, res) => {
  let fstream;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {

    //Path where image will be uploaded
    fstream = fs.createWriteStream(pathPh.pathPhoto + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.status(200).send({msg: 'Upload réussi'});
    });
  });
}

exports.getIngrUst = (req, res) => {
  requette = `SELECT * FROM ingredient; ` +
    `SELECT * FROM ustensile;`;

  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({
        ingredients: rows[0],
        ustensiles: rows[1]
      });
    })
}



exports.ajoutIngredient = (req, res) => {
  requette = `INSERT INTO ingredient (nom, unite) VALUES `;
  

  req.body.newIngredients.forEach(ingr => {
    //Echappe \ puis '
    ingr.nomI = ingr.nomI.replace(/\\/g, '\\\\');
    ingr.nomI = ingr.nomI.replace(/'/g, "\\'");
    ingr.unite = ingr.unite.replace(/\\/g, '\\\\');
    ingr.unite = ingr.unite.replace(/'/g, "\\'");
    requette += `('${ingr.nomI}', '${ingr.unite}'),`;
  });
  requette = requette.slice(0, requette.length -1);


  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({msg: 'Ingrédients ajoutés'});
    })

}

exports.ajoutUstensile = (req, res) => {
  requette = `INSERT INTO ustensile (nom) VALUES `;
  
  req.body.newUstensiles.forEach(ust => {
    //Echappe \ puis '
    ust.nomU = ust.nomU.replace(/\\/g, '\\\\');
    ust.nomU = ust.nomU.replace(/'/g, "\\'");
    requette += `('${ust.nomU}'),`;
  });
  requette = requette.slice(0, requette.length -1);


  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({msg: 'Ustensiles ajoutés'});
    })

}


