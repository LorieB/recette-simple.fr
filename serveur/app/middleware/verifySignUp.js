const sql = require("../models/db.js");



checkDuplicateUsernameOrEmail = (req, res, next) => {
  sql.query(`SELECT * FROM users WHERE username = '${req.body.username}'; SELECT * FROM users WHERE email = '${req.body.email}'; `,
    (err, rows) => {
      if (err) throw err;

      if (rows[0].length > 0) {
        res.status(400).send({
          message: "Failed! Username is already in use!"
        });
        return;
      }
      if (rows[1].length > 0) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    }
  );
}


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    sql.query(`SELECT name FROM roles WHERE name IN ${req.body.roles}`,
      (err, rows) => {
        if (err) throw err;

        if (rows.length != req.body.roles.length) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]
          });
          return;
        }

      });
  }

  next();
}


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
