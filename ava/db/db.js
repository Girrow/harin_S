const mysql = require("mysql");
const db_config = require("./db_config");

const db = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database
});

db.connect(function(err) {
  if (err) throw err;
});

module.exports = db;
