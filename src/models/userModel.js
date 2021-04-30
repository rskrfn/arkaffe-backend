const connect = require('../database/dbMysql');

const getAccountInfo = (data) => {
  return new Promise((resolve, reject) => {
    const qs = `SELECT email,username AS display_name,first_name,last_name,phone AS phone_number,role_id,photo_profile AS avatar, gender, birthdate AS birthday, address_user AS address FROM users WHERE id = ?`;
    connect.query(qs, data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const updateAccount = (data, id) => {
  return new Promise((resolve, reject) => {
    const queryString = 'UPDATE users SET WHERE id = ?';
    connect.query(queryString, [data, id], (error, result) => {
      if (error) return reject(error);
      if (result.affectedRows > 0) return resolve(true);
      return resolve(false);
    });
  });
};

const deleteAccount = (qsValue) => {
  return new Promise((resolve, reject) => {
    const qs = `DELETE FROM tb_account WHERE id_account= ? `;
    connect.query(qs, qsValue, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
module.exports = {
  getAccountInfo,
  updateAccount,
  deleteAccount,
};
