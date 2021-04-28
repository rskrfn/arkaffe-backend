const authModel = require('../models/authModel');
const responseStandard = require('../helpers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const phoneExist = await authModel.checkPhoneModel(phone);
    if (phoneExist.length) {
      return responseStandard(res, 'Phone already exists', {}, 400, false);
    } else {
      const emailExist = await authModel.checkEmailModel(email);
      if (emailExist.length) {
        return responseStandard(res, 'Email already exists', {}, 400, false);
      }
    }
    const users = {
      email: email,
      phone: phone,
      password: hashedPassword,
    };
    await authModel.createAccountModel(users);
    return responseStandard(res, 'user resgistered', {}, 200, true);
  } catch (err) {
    responseStandard(res, err.message, {}, 400, false);
  }
};

const Login = async (req, res) => {
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
  Register,
  Login
};
