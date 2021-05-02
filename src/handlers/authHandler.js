const authModel = require('../models/authModel');
const responseStandard = require('../helpers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return responseStandard(
        res,
        'Some fields can not be empty',
        {},
        400,
        false,
      );
    }

    if (password.length < 8) {
      return responseStandard(
        res,
        'Password must be longer than 8 characters',
        {},
        400,
        false,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailExist = await authModel.checkEmailModel(email);
    if (emailExist.length) {
      return responseStandard(res, 'Email already exists', {}, 400, false);
    }

    const phoneExist = await authModel.checkPhoneModel(phone);
    if (phoneExist.length) {
      return responseStandard(res, 'Phone already exists', {}, 400, false);
    }
    const emailSplit = email.split('@');
    const users = {
      username: emailSplit[0],
      email: email,
      phone: phone,
      password: hashedPassword,
    };
    await authModel.createAccountModel(users);
    return responseStandard(res, 'User registered', {}, 200, true);
  } catch (err) {
    responseStandard(res, err.message, {}, 400, false);
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body || '';
  const userTaken = (await authModel.getUserByEmail(email)) || [];
  if (userTaken.length < 1) {
    responseStandard(res, 'User does not exist', {}, 403, false);
    return;
  }
  authModel
    .getUserByEmail(email)
    .then((result) => {
      bcrypt.compare(password, result[0].password, (err, passwordValid) => {
        if (err) {
          responseStandard(res, err, {}, 500, false);
        }
        if (!passwordValid) {
          responseStandard(res, 'Wrong password', {}, 403, false);
        }
        if (passwordValid) {
          const { id, username, email, photo_profile, role_id } = result[0];
          const payload = { id, username, role_id };
          const options = {
            expiresIn: process.env.EXPIRE,
            issuer: process.env.ISSUER,
          };
          jwt.sign(payload, process.env.SECRET_KEY, options, (err, token) => {
            if (err) {
              responseStandard(res, err, {}, 500, false);
            }
            responseStandard(
              res,
              'User logged in',
              {
                id,
                username,
                email,
                displayPicture: photo_profile,
                role: role_id,
                token,
              },
              200,
              true,
            );
          });
        }
      });
    })
    .catch((err) => {
      responseStandard(res, err, 500, false);
    });
};

const resetPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { newPassword } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await authModel.resetPassword([hashedPassword, id]);
    return responseStandard(res, 'Reset Password successfully!', {}, 200, true);
  } catch (error) {
    responseStandard(res, error, 500, false);
  }
};

const logout = async (req, res) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.split(' ')[1];

    if (!token) {
      return responseStandard(res, 'No token provided', {}, 400, false);
    }

    await authModel.setToken(token);
    return responseStandard(res, 'Logout success', {}, 200, true);
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  Register,
  Login,
  resetPassword,
  logout,
};
