const Router = require('express').Router();
const productHandler = require('../handlers/productHandler');
const {
  errorMulterHandler,
  uploadProductImage,
} = require('../middlewares/uploadImages');

Router.get('/', productHandler.getProduct);

Router.post(
  '/',
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.createProduct,
);

Router.patch('/:productId', productHandler.updateProduct);

Router.delete('/:productId', productHandler.deleteProduct);

module.exports = Router;
