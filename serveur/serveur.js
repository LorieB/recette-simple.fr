const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  // origin: "http://localhost:4200"
  origin: ["http://recette-simple-fr.mon.world", "https://recette-simple-fr.mon.world"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenu sur l'appli de recettes" });
});

// routes
require('./app/routes/auth.routes')(app);
// require('./app/routes/user.routes')(app);
require('./app/routes/recette.routes')(app, express);
require('./app/routes/recherche.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
