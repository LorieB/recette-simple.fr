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

  requette = `SELECT recette.id, titre, sucre, chaud, tempsPreparation, tempsCuisson, temperatureCuisson, instructions, photo, id_user, ` +
    `GROUP_CONCAT(DISTINCT '"id": "', ingredient.id, '", ', '"nom": "', ingredient.nom, '", ', '"unite": "', ingredient.unite, '", ', '"quantite": ', ingr_recette.quantite SEPARATOR '},{')  AS ingredients, ` + //Mise en forme du résultat pour correspondre à un objet json 
    `GROUP_CONCAT(DISTINCT '"id": ', ustensile.id, ', ', '"nom": "', ustensile.nom,'"' SEPARATOR '},{') AS ustensiles ` +
    `FROM recette ` +
    `INNER JOIN ingr_recette ON recette.id = ingr_recette.id_recette ` +
    `INNER JOIN ingredient ON ingr_recette.id_ingredient = ingredient.id ` +
    `INNER JOIN ust_recette ON recette.id = ust_recette.id_recette ` +
    `INNER JOIN ustensile ON ust_recette.id_ustensile = ustensile.id ` +
    `WHERE titre = '${req.params.titre}' ; `;

  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      if(rows[0].id == null){
        res.status(404).send({msg: 'Recette non trouvée'})
      }else{
        tmp = rows[0].tempsPreparation.split(':');
        rows[0].tempsPreparation = { hours: +tmp[0], minutes: +tmp[1] };
  
        if (rows[0].tempsCuisson) {
          tmp = rows[0].tempsCuisson.split(':');
          rows[0].tempsCuisson = { hours: +tmp[0], minutes: +tmp[1] };
        }
  
        rows[0].ingredients = JSON.parse('[{' + rows[0].ingredients + '}]');
        rows[0].ustensiles = JSON.parse('[{' + rows[0].ustensiles + '}]');
  
        res.status(200).send(rows[0]);
      }

    })
}


exports.ajouterRecette = (req, res) => {

    //Si absence de photo met celle par défaut selon si sucré ou salé
    if (req.body.photo == '') {
      req.body.photo = req.body.sucre ? 'cake.png' : 'spaguetti.png';
    }
    //transforme le tableau d'étapes en une string d'instructions
    let instructions = '';
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


    requette = `INSERT INTO recette (titre, sucre, chaud, tempsPreparation, tempsCuisson, temperatureCuisson, instructions, photo, id_user) VALUES ('${req.body.titre}', ${req.body.sucre}, ${req.body.chaud}, '${req.body.tempsPreparation}', '${req.body.tempsCuisson}', ${req.body.temperatureCuisson}, '${instructions}', '${req.body.photo}', ${req.body.id_user}); ` +
      `SET @idRecette = LAST_INSERT_ID(); `;

    //Insert ustensiles
    requette += `INSERT INTO ust_recette (id_ustensile, id_recette) VALUES `;
    for (let ust of req.body.ustensiles) {
      requette += `(${ust}, @idRecette),`;
    }
    requette = requette.slice(0, requette.length - 1);
    requette += `; `;

    //Insert ingredients
    requette += `INSERT INTO ingr_recette (id_ingredient, id_recette, quantite) VALUES `;
    for (let ingr of req.body.ingredients) {
      requette += `(${ingr.id}, @idRecette, ${ingr.quantite}),`;
    }
    requette = requette.slice(0, requette.length - 1);
    requette += `; `;


    sql.query(requette,
      (err, rows) => {
        if (err) throw err;

        res.status(200).send({ msg: 'Recette crée !' });
      });
  
}


exports.modifierRecette = (req, res) => {

    //Si absence de photo met celle par défaut selon si sucré ou salé
    if (req.body.photo == '') {
      req.body.photo = req.body.sucre ? 'cake.png' : 'spaguetti.png';
    }
    //transforme le tableau d'étapes en une string d'instructions
    let instructions = '';
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


    requette =
      `UPDATE recette ` +
      `SET titre = '${req.body.titre}', sucre = ${req.body.sucre}, chaud = ${req.body.chaud}, tempsPreparation = '${req.body.tempsPreparation}', tempsCuisson = '${req.body.tempsCuisson}', temperatureCuisson = ${req.body.temperatureCuisson}, instructions = '${instructions}', photo = '${req.body.photo}' ` +
      `WHERE id = ${req.body.id}; `
      ;

    
    //Si ustensiles modifié Insert ustensiles
    if (req.body.ustensiles != 'pristine') {
      requette += `DELETE FROM ust_recette WHERE id_recette = ${req.body.id}; `;
      requette += `INSERT INTO ust_recette (id_ustensile, id_recette) VALUES `;
      for (let ust of req.body.ustensiles) {
        requette += `(${ust}, ${req.body.id}),`;
      }
      requette = requette.slice(0, requette.length - 1);
      requette += `; `;

    }

    //Si ingredients modifié Insert ingredients
    if (req.body.ingredients != 'pristine') {
      requette += `DELETE FROM ingr_recette WHERE id_recette = ${req.body.id}; `;
      requette += `INSERT INTO ingr_recette (id_ingredient, id_recette, quantite) VALUES `;
      for (let ingr of req.body.ingredients) {
        requette += `(${ingr.id}, ${req.body.id}, ${ingr.quantite}),`;
      }
      requette = requette.slice(0, requette.length - 1);
      requette += `; `;
    }

    sql.query(requette,
      (err, rows) => {
        if (err) throw err;

        res.status(200).send({ msg: 'Modification réussie' });
      });
  
}


exports.supprimerRecette = (req, res) => {
  requette = `DELETE FROM recette WHERE id = ${req.body.id}; `+
  `DELETE FROM ingr_recette WHERE id_recette = ${req.body.id}; `+
  `DELETE FROM ust_recette WHERE id_recette = ${req.body.id}; `;


  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({ msg: 'Suppression réussie' });
    });
}



exports.upload = (req, res) => {
  let fstream;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {

    //Path where image will be uploaded
    fstream = fs.createWriteStream(pathPh.pathPhoto + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.status(200).send({ msg: 'Upload réussi' });
    });
  });
}

exports.supprPhoto = (req, res) => {
  fs.remove(pathPh.pathPhoto+req.body.nom, err => {
    if (err) return console.error(err)
    res.status(200).send({ msg: 'Suppression réussi' });
  })
}

async function deleteImg(images) {
  try {
      for (let img of images) {
          await fs.remove(dossier + "/" + img);
      }
  } catch (err) {
      console.error(err)
  }
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
  requette = requette.slice(0, requette.length - 1);


  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({ msg: 'Ingrédients ajoutés' });
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
  requette = requette.slice(0, requette.length - 1);


  sql.query(requette,
    (err, rows) => {
      if (err) throw err;

      res.status(200).send({ msg: 'Ustensiles ajoutés' });
    })

}


