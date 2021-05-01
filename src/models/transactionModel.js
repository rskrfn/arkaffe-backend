const connect = require('../database/dbMySql');

const addTransaction = (transaction) => {
  return new Promise((resolve, reject) => {
    const queryString = 'INSERT INTO transaction SET ?';

    connect.query(queryString, transaction, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateTransaction = (payment, code, setTime, deliveryTable, cartId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'UPDATE transaction SET payment_method = ?, code_transaction = ?, set_time = ?, delivery_table = ? WHERE cart_id =?';

    const paramData = [payment, code, setTime, deliveryTable, cartId];

    connect.query(queryString, paramData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  addTransaction,
  updateTransaction,
};
