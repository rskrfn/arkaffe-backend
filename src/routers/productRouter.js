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

Router.post(
  '/upload',
  errorMulterHandler(uploadProductImage.single('image')),
  (req, res) => {
    const { file } = req;
    const url = `/products/${file.filename}`;
    res.status(200).json({
      msg: 'Upload Success',
      url,
    });
  },
);

Router.patch(
  '/:productId',
  errorMulterHandler(uploadProductImage.single('image')),
  productHandler.updateProduct,
);

Router.delete('/:productId', productHandler.deleteProduct);

module.exports = Router;
