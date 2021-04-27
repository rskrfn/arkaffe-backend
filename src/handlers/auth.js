const authModel = require('../models/auth');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const response = require('../helpers/response');

const login = async (req, res) => {
  const { email, password } = req.body || '';

  const userTaken = (await authModel.getUserByEmail(email)) || [];

  if (userTaken.length < 1) {
    response(res, 'user does not exist', {}, 403, false);
    return;
  }

  authModel
    .getUserByEmail(email)
    .then((result) => {
      bcrypt.compare(password, result[0].password, (err, passwordValid) => {
        if (err) {
          response(res, err, {}, 500, false);
        }

        if (!passwordValid) {
          response(res, 'wrong password', {}, 403, false);
        }

        if (passwordValid) {
          const { id, username, role_id } = result[0];
          const payload = { id, username, role_id };
          const options = {
            expiresIn: process.env.EXPIRE,
            issuer: process.env.ISSUER,
          };

          jwt.sign(payload, procces.env.SECRET_KEY, options, (err, token) => {
            if (err) {
              response(res, err, {}, 500, false);
            }

            response(
              res,
              'success',
              { id, username, role: role_id, token },
              200,
              true,
            );
          });
        }
      });
    })
    .catch((err) => {
      response(res, err, 500, false);
    });
};

module.exports = {
  login,
};
