const config = require("../config/auth.config");

const sql = require("../models/db.js");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// Save User to Database
exports.signup = (req, res) => {
  username = req.body.username;
  email = req.body.email;
  password = bcrypt.hashSync(req.body.password, 8);

  requette = `INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}'); ` +
    `SELECT id FROM users WHERE username = '${username}';`;

  sql.query(requette,
    (err, rows) => {
      if (err) throw err;


      if (req.body.roles) {
        requette = `INSERT INTO user_roles (roleId, userId VALUES  `;
        req.body.roles.forEach(element => {
          requette += `(${rows[0].id}, ${element}),`;
        });
        requette = requette.slice(0, requette.length - 1);
        requette += `;`;
      }
      else {
        requette = `INSERT INTO user_roles (roleId, userId) VALUES (1, ${rows[1][0].id}); `;
      }

      sql.query(requette,
        (err, rows) => {
          if (err) throw err;

          res.send({ message: "Utilisateur enregistré!" });
        });
    });
}



exports.signin = (req, res) => {
  sql.query(`SELECT users.id, username, email, password, GROUP_CONCAT(roles.name) AS roles FROM users ` +
    `INNER JOIN user_roles ON users.id = user_roles.userId ` +
    `INNER JOIN roles ON user_roles.roleId = roles.id ` +
    `WHERE username = '${req.body.username}' `
    ,
    (err, rows) => {
      if (err) throw err;
      
      if (rows.length == 0) {
        return res.status(404).send({ message: "Nom d'utilisateur erroné" });
      }

      //Test mdp
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        rows[0].password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mot de passe erroné"
        });
      }

      var token = jwt.sign({ id: rows[0].id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });


      var authorities = [];

      rows[0].roles = rows[0].roles.split(',');

      rows[0].roles.forEach(role => {
        authorities.push("ROLE_" + role.toUpperCase());
      })


      res.status(200).send({
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email,
        roles: authorities,
        accessToken: token
      });

    });
}