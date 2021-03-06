require('dotenv').config();

const mysql = require('mysql');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const dbMySql = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

dbMySql.connect((err) => {
  if (err) throw err;
});

module.exports = dbMySql;
