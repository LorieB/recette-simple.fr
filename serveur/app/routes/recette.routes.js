const { authJwt, verifRecette } = require("../middleware");
const controller = require("../controllers/recette.controller");

const pathPh = require("../config/path.config");

const busboy = require('connect-busboy'); //middleware for form/file upload
const path = require('path');     //used for file path


module.exports = function(app, express) {
  app.use(busboy());
  app.use(express.static(path.join(pathPh.pathPhoto, 'public')));
  
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/recettes", controller.getRecettes);

  app.get("/api/recette/:titre", controller.getRecetteByTitre);

  app.get("/api/IngrUst", controller.getIngrUst);

  app.post("/api/ajout-recette", [authJwt.verifyToken, verifRecette.titreDispo], controller.ajouterRecette);

  app.post("/api/modifier-recette", [authJwt.verifyToken, verifRecette.peutEditer, verifRecette.titreDispo], controller.modifierRecette);

  app.post("/api/suppr-recette", [authJwt.verifyToken, verifRecette.peutEditer], controller.supprimerRecette);


  app.post('/api/upload', [authJwt.verifyToken], controller.upload);

  app.post('/api/suppr-photo', [authJwt.verifyToken, verifRecette.peutEditer], controller.supprPhoto);


  app.post('/api/ajout-ingredient', [authJwt.verifyToken], controller.ajoutIngredient);

  app.post('/api/ajout-ustensile', [authJwt.verifyToken], controller.ajoutUstensile);
}