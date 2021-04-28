const connect = require("../database/dbMysql")

const getAccountInfo =(data) => {
  return new Promise((resolve, reject) => {
    const qs = `SELECT username,phone_number,role,photo_profile FROM tb_account WHERE id_account = ?`;
    connect.query(qs, data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
const updateAccount = (qsValue, id) => {
  return new Promise((resolve, reject) => {
    const qs = `UPDATE tb_account SET ? WHERE id_account = ?`;
    connect.query(qs, [qsValue, id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const qsUpdated =
          'SELECT username,phone_number,role,photo_profile from tb_account WHERE id_account = ?';
        connect.query(qsUpdated, qsValue, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve((result = { ...result, ...data }));
          }
        });
      }
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