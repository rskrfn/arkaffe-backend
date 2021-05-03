const responseStandard = require('../helpers/response');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const authModel = require('../models/authModel');

const authentikasi = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    if (!token) {
      return responseStandard(res, 'No token provided', {}, 400, false);
    }

    const verify = jwt.verify(token, SECRET_KEY);
    if (!verify) {
      return responseStandard(res, 'Unauthorized access', {}, 403, false);
    }

    const tokenTaken = await authModel.getToken(token);
    if (tokenTaken.length > 0) {
      return responseStandard(res, 'You have to login', {}, 400, false);
    }

    req.user = verify;
    return next();
  } catch (err) {
    console.log(err);
    return responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  authentikasi,
};
