const { query } = require('../database/dbMySql');
const connect = require('../database/dbMySql');

const addCart = (userId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'INSERT INTO cart (users_id) VALUES (?)';

    connect.query(queryString, userId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getCartUser = (userId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT * FROM cart WHERE users_id = ?';

    connect.query(queryString, userId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteCart = (userId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'DELETE FROM cart WHERE users_id = ?';

    connect.query(queryString, userId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const addCartItem = (cartId, productId, quantity, sizeId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'INSERT INTO cart_item (cart_id, product_id, quantity, size_id) VALUES (?,?,?,?)';

    connect.query(
      queryString,
      [cartId, productId, quantity, sizeId],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
};

const deleteCartItem = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'DELETE FROM cart_item WHERE product_id = ?';

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  addCart,
  getCartUser,
  addCartItem,
  deleteCart,
  deleteCartItem,
};
