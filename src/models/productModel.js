const connect = require('../database/dbMySql');

const getProduct = (
  searchValue,
  category,
  sortBy,
  order,
  pageNumber,
  offset,
) => {
  return new Promise((resolve, reject) => {
    let queryString = [
      'SELECT p.id, p.image_product, p.name, p.price FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE p.name LIKE ?',
    ];

    let paramData = [searchValue];

    if (category) {
      queryString.push('AND c.name = ?');
      paramData.push(category);
    }

    if (sortBy && order) {
      queryString.push('ORDER BY ? ?');
      paramData.push(sortBy, order);
    }

    queryString.push('LIMIT ? OFFSET ?');
    paramData.push(pageNumber, offset);

    let total = 0;

    connect.query(queryString.join(' '), paramData, (err, result) => {
      if (err) return reject(err);

      let queryCount = [
        'SELECT COUNT(*) AS total FROM product p LEFT JOIN category c ON p.category_id = c.id WHERE p.name LIKE ?',
      ];

      if (category) {
        queryCount.push('AND c.name =?');
      }

      if (sortBy && order) {
        queryCount.push('ORDER BY ? ?');
      }

      connect.query(
        queryCount.join(' '),
        paramData,
        (errCount, resultCount) => {
          if (errCount) return reject(errCount);

          total = resultCount[0].total;
          resolve({ data: result, total });
        },
      );
    });
  });
};

const getProductInfo = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT p.name, p.price, p.description, p.image_product AS 'imageProduct', p.start_delivery AS 'startDelivery', p.end_delivery FROM product p WHERE p.id =?`;

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getSizeInfo = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT GROUP_CONCAT(size_id SEPARATOR ', ') AS size FROM product_size WHERE product_id =?`;

    connect.query(queryString, productId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getDeliveryInfo = (productId) => {
  return new Promise((resolve, reject) => {
    const queryString = `SELECT GROUP_CONCAT(delivery_id SEPARATOR ', ') AS delivery FROM product_delivery WHERE product_id =?`;

    connect.query(queryString, productId, (err, result) => {
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

const updateProduct = (name, price, description, stock, url, productId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'UPDATE product p SET p.name=?, p.price=?, p.description=?, p.stock=?, p.image_product=? WHERE p.id=?';

    const data = [name, price, description, stock, url, productId];

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
    const queryString = 'DELETE FROM product WHERE id = ?';

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
  getProductInfo,
  getSizeInfo,
  getDeliveryInfo,
};
