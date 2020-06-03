module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "dbrecette",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// module.exports = {
//   HOST: "localhost",
//   USER: "recetkmr_admin",
//   PASSWORD: "Uu52Jen9VTM",
//   DB: "recetkmr_dbrecette",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };