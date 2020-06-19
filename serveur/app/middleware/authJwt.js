const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const sql = require("../models/db.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};


isAdmin = (req, res, next) => {
  sql.query(`SELECT * FROM users 
  INNER JOIN user_roles ON users.id = user_roles.userId
  INNER JOIN roles ON user_roles.roleId = roles.id 
  WHERE users.id = ${req.userId} AND roles.name = 'admin'`,
    (err, rows) => {
      if (err) throw err;

      if (rows.length > 0) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
}


isModerator = (req, res, next) => {
  sql.query(`SELECT * FROM users 
  INNER JOIN user_roles ON users.id = user_roles.userId
  INNER JOIN roles ON user_roles.roleId = roles.id 
  WHERE users.id = ${req.userId} AND roles.name = 'moderator'`,
    (err, rows) => {
      if (err) throw err;

      if (rows.length > 0) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
      return;
    });
}


isModeratorOrAdmin = (req, res, next) => {
  sql.query(`SELECT * FROM users 
  INNER JOIN user_roles ON users.id = user_roles.userId
  INNER JOIN roles ON user_roles.roleId = roles.id 
  WHERE users.id = ${req.userId} AND (roles.name = 'moderator' OR roles.name = 'admin')`,
    (err, rows) => {
      if (err) throw err;

      if (rows.length > 0) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
      return;
    });
}
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
