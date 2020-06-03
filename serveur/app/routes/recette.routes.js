const { authJwt } = require("../middleware");
const controller = require("../controllers/recette.controller");

// const pathPhoto = 'C:/Users/Moi/code/recette-simple/recette-app/src/assets/photos/';
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

  app.post("/api/ajout-recette", [authJwt.verifyToken], controller.ajouterRecette);

  app.post('/api/upload', controller.upload);
}