const connect = require('../database/dbMySql');

const addTestimonial = (testimonial) => {
  return new Promise((resolve, reject) => {
    const queryString = 'INSERT INTO testimonial SET ?';

    connect.query(queryString, testimonial, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const editTestimonial = (description, rating, userId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'UPDATE testimonial SET description = ?, rating = ? WHERE users_id = ?';

    connect.query(queryString, [description, rating, userId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getTestimonial = (userId) => {
  return new Promise((resolve, reject) => {
    const queryString =
      'SELECT description AS message, rating FROM testimonial WHERE users_id = ?';

    connect.query(queryString, userId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  addTestimonial,
  editTestimonial,
  getTestimonial,
};
