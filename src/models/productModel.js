const connect = require('../database/dbMySql');

const getProduct = (searchValue, category) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'SELECT p.id, p.image_product, p.name, p.price FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE p.name LIKE ? AND c.name =?';

    connect.query(queryString, [searchValue, category], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT * FROM product WHERE id =?';

    connect.query(queryString, id, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getProductByName = (name) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT * FROM product WHERE name=?';

    connect.query(queryString, name, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createProduct = (product) => {
  return new Promise((resolve, reject) => {
    const queryString = 'INSERT INTO product SET ?';

    connect.query(queryString, product, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateProduct = (name, price, description, stock, productId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'UPDATE product p SET p.name=?, p.price=?, p.description=?, p.stock=? WHERE p.id=?';

    const data = [name, price, description, stock, productId];

    connect.query(queryString, data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'DELETE FROM product p WHERE p.id = ?';

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getProductSize = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT * FROM product_size WHERE product_id=?';

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getProductDelivery = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'SELECT * FROM product_delivery WHERE product_id=?';

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createProductSize = (sizes, productId, stockSize) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'INSERT INTO product_size (size_id, product_id, stock_size) VALUES (?,?,?)';

    sizes.map((size) => {
      const sizeNumber = Number(size);
      connect.query(
        queryString,
        [sizeNumber, productId, stockSize],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  });
};

const createProductDelivery = (deliveries, productId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'INSERT INTO product_delivery (delivery_id, product_id) VALUES (?,?)';

    deliveries.map((delivery) => {
      const deliveryNumber = Number(delivery);
      connect.query(queryString, [deliveryNumber, productId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });
};

const deleteProductSize = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'DELETE FROM product_size WHERE product_id=?';

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteProductDelivery = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = 'DELETE FROM product_delivery WHERE product_id=?';

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
  getProduct,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSize,
  getProductDelivery,
  createProductSize,
  createProductDelivery,
  deleteProductSize,
  deleteProductDelivery,
};
