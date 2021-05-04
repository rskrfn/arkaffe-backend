const Router = require('express').Router();
const productHandler = require('../handlers/productHandler');
const {
  errorMulterHandler,
  uploadProductImage,
} = require('../middlewares/uploadImages');
const { isStaff } = require('../middlewares/authorization');

Router.get('/', productHandler.getProduct);

Router.get('/:productId', productHandler.getProductInfo);

Router.post(
  '/',
  isStaff,
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.createProduct,
);

Router.patch(
  '/:productId',
  isStaff,
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.updateProduct,
);

Router.delete('/:productId', isStaff, productHandler.deleteProduct);

module.exports = Router;
