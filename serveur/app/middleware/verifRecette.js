const sql = require("../models/db.js");


peutEditer = (req, res, next) => {
    sql.query(`SELECT * FROM users 
    INNER JOIN user_roles ON users.id = user_roles.userId
    INNER JOIN roles ON user_roles.roleId = roles.id 
    WHERE (users.id = ${req.userId} AND roles.name = 'admin') 
    OR ${req.userId} = (SELECT id_user FROM recette WHERE id = ${req.body.id})`,
    (err, rows) => {
      if(err) throw err;
  
      if (rows.length > 0) {
        next();
        return;
      }
  
      res.status(403).send("Modification non autorisé!" );
      return;
  
    })
  }


titreDispo = (req, res, next) => {
  //Vérifie si le nom est déjà pris
  requette = `SELECT id FROM recette WHERE titre = '${req.body.titre}'`;
  if(req.body.id){ //Si édition id disponible
    requette += ` AND id != ${req.body.id};`;
  } 
  sql.query(requette, (err, rows) => {
    if (err) throw err;

    if (rows.length > 0){ 
      res.status(400).send('Titre déjà pris');
      return;
    }
    
    next();
    return;
  })
}



const verifRecette = {
  peutEditer: peutEditer,
  titreDispo: titreDispo
};
module.exports = verifRecette;