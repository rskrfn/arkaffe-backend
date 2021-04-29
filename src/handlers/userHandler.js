const userModel = require('../models/userModel');
const responseStandard = require('../helpers/response');
const fs = require('fs-extra');
const bcrypt = require('bcrypt');
const {
  uploadAvatarImage,
  errorMulterHandler,
} = require('../middlewares/uploadImages');

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

const updateProfile = (req, res) => {
  const uploadImage = errorMulterHandler(uploadAvatarImage.single('pictures'));
  const { id } = req.user;
  userModel.getAccountInfo(id, (err, result) => {
    if (!err) {
      if (result.length) {
        uploadImage(req, res, (error) => {
          if (error) {
            return responseStandard(res, error.message, {}, 400, false);
          } else {
            const image = req.file;
            const {
              email = '',
              password = '',
              username = '',
              phone = '',
              birthday = '',
              gender_id = '',
            } = req.body;

            if (
              email.trim() ||
              password.trim() ||
              username.trim() ||
              phone.trim() ||
              birthday.trim() ||
              gender_id.trim() ||
              image
            ) {
              const patchData = Object.entries(req.body).map((el) => {
                if (el[0] === 'password') {
                  const salt = bcrypt.genSalt(10);
                  const hashedPassword = bcrypt.hash(password, salt);
                  return `${el[0]} = '${hashedPassword}'`;
                }
                return `${el[0]} = '${el[1].replace(/'/gi, "''")}'`;
              });

              if (image) {
                patchData.push(`photo_profile = '/avatars/${image.filename}'`);
              }

              userModel.updateAccount(id, patchData, (error, results) => {
                if (!error) {
                  if (results.affectedRows) {
                    if (result[0].photo_profile !== '') {
                      fs.unlinkSync(`public/images/${result[0].photo_profile}`);
                    }
                    return responseStandard(
                      res,
                      `Success update costumer with ID ${id}!`,
                      {},
                    );
                  } else {
                    return responseStandard(
                      res,
                      `Update failed! ID ${id} not found`,
                      {},
                      400,
                      false,
                    );
                  }
                } else {
                  return responseStandard(res, error.message, {}, 500, false);
                }
              });
            } else {
              return responseStandard(
                res,
                'All field must be fill',
                {},
                400,
                false,
              );
            }
          }
        });
      } else {
        return responseStandard(res, 'No data found', {}, 200, false);
      }
    } else {
      return responseStandard(res, err.message, {}, 500, false);
    }
  });
};

module.exports = {
  getProfileInfo,
  updateProfile,
};
