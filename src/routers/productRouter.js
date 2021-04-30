const Router = require('express').Router();
const productHandler = require('../handlers/productHandler');
const {
  errorMulterHandler,
  uploadProductImage,
} = require('../middlewares/uploadImages');

Router.get('/', productHandler.getProduct);

Router.get('/:productId', productHandler.getProductInfo);

Router.post(
  '/',
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.createProduct,
);

Router.patch(
  '/:productId',
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.updateProduct,
);

Router.delete('/:productId', productHandler.deleteProduct);

module.exports = Router;
