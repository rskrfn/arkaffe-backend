const connect = require('../database/dbMySql');

const createAccountModel = (data) => {
  return new Promise((resolve, reject) => {
    const queryString = 'INSERT INTO users SET?';
    connect.query(queryString, data, (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

const checkEmailModel = (email) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT email FROM users WHERE email = ?';
    connect.query(queryString, email, (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

const checkPhoneModel = (phone) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT phone FROM users WHERE phone = ?';
    connect.query(queryString, phone, (error, results) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
};

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
  createAccountModel,
  checkEmailModel,
  checkPhoneModel,
  getUserByEmail,
};
