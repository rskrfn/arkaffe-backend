const Router = require('express').Router();
const userHandler = require('../handlers/userHandler');
const {
  uploadAvatarImage,
  errorMulterHandler,
} = require('../middlewares/uploadImages');

Router.get('/', userHandler.getProfileInfo);
Router.patch(
  '/edit',
  errorMulterHandler(uploadAvatarImage.single('image')),
  userHandler.updateProfile,
);

module.exports = Router;
