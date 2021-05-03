const userModel = require('../models/userModel');
const responseStandard = require('../helpers/response');
const bcrypt = require('bcrypt');

const getProfileInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const users = await userModel.getAccountInfo(id);
    if (users.length) {
      return responseStandard(res, 'User Profile', { data: users }, 200, true);
    } else {
      return responseStandard(res, 'User profile not found!!', {}, 404, false);
    }
  } catch (error) {
    return responseStandard(res, error, 500, false);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    let valueUpdate = req.body;
    const users = await userModel.getAccountInfo(id);
    if (!users) {
      responseStandard(res, 'Users not found !!', {}, 404, false);
    }
    console.log(req.file);
    if (req.file) {
      const { file } = req;
      const url = `/images/${file.filename}`;
      const photo_profile = url;
      valueUpdate = { ...valueUpdate, photo_profile };
    }
    console.log(valueUpdate);
    const results = await userModel.updateAccount(valueUpdate, id);
    responseStandard(res, 'Profile has been updated', {}, 200, true);
  } catch (err) {
    responseStandard(res, err.message, {}, 400, false);
  }
};

module.exports = {
  getProfileInfo,
  updateProfile,
};
