const responseStandard = require('../helpers/response');

const isStaff = (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return responseStandard(res, 'Unauthorized', {}, 401, false);
    } else if (user.role_id !== 1) {
      return responseStandard(res, 'Forbidden access!!', {}, 403, false);
    }
    return next();
  } catch (error) {
    return responseStandard(res, error, {}, 401, false);
  }
};

const isCustomer = (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return responseStandard(res, 'Unauthorized', {}, 401, false);
    } else if (user.role_id !== 2) {
      return responseStandard(res, 'Forbidden access!!', {}, 403, false);
    }
    return next();
  } catch (error) {
    return responseStandard(res, error, {}, 401, false);
  }
};

module.exports = {
  isStaff,
  isCustomer,
};
