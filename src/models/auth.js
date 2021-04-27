const connect = require('../database/dbMySql');

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT * FROM users WHERE email=?`;

    connect.query(queryString, email, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  getUserByEmail,
};
