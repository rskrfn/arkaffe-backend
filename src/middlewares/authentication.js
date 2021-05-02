const authModel = require('../models/authModel');
const responseStandard = require('../helpers/response');
const jwt = require('jasonwebtoken');

const authenticateToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    if (!token) {
      return responseStandard(res, 'No token provided', {}, 400, false);
    }

    const verivy = jwt.verivy(token, process.env.SECRET_KEY);
    if (!verivy) {
      return responseStandard(res, 'Unauthorized access', {}, 403, false);
    }

    const tokenTaken = await authModel.getToken(token);
    if (tokenTaken) {
      return responseStandard(res, 'You have to login', {}, 400, false);
    }

    return next();
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  authenticateToken,
};
