const {
  createAccountModel,
  checkEmailModel,
  checkPhoneModel,
} = require('../models/authModel');
const responseStandard = require('../helpers/response');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const phoneExist = await checkPhoneModel(phone);
    if (phoneExist.length) {
      return responseStandard(res, 'Phone already exists', {}, 400, false);
    } else {
      const emailExist = await checkEmailModel(email);
      if (emailExist.length) {
        return responseStandard(res, 'Email already exists', {}, 400, false);
      }
    }
    const users = {
      email: email,
      phone: phone,
      password: hashedPassword,
    };
    await createAccountModel(users);
    return responseStandard(res, 'user resgistered', {}, 200, true);
  } catch (err) {
    responseStandard(res, err.message, {}, 400, false);
  }
};

module.exports = {
  Register,
};
