// const mysql = require('mysql');
const productModel = require('../models/productModel');
const responseStandard = require('../helpers/response');

const getProduct = async (req, res) => {
  const { search, category } = req.query || '';

  const searchValue = `%${search || ''}%`;

  productModel
    .getProduct(searchValue, category)
    .then((result) => {
      responseStandard(res, 'product information', result, 200, true);
    })
    .catch((err) => {
      responseStandard(res, err, {}, 500, false);
    });
};

const createProduct = async (req, res) => {
  const {
    category,
    name,
    price,
    description,
    stock,
    startDelivery,
    endDelivery,
    sizeId,
    stockSize,
    deliveryId,
  } = req.body;

  const product = {
    category_id: category,
    name,
    price: Number(price) || 0,
    description,
    stock,
    start_delivery: startDelivery,
    end_delivery: endDelivery,
  };

  const sizes = sizeId.split(',');
  const deliveries = deliveryId.split(',');

  const createProduct = await productModel.createProduct(product);

  if (createProduct) {
    const productTaken = (await productModel.getProductByName(name)) || [];
    console.log(productTaken);
    const productId = productTaken[0].id;
    const createProductSize = await productModel.createProductSize(
      sizes,
      productId,
      stockSize,
    );

    if (createProductSize) {
      productModel
        .createProductDelivery(deliveries, productId)
        .then((result) => {
          responseStandard(res, 'product created', {}, 200, true);
        })
        .catch((err) => {
          responseStandard(res, err, {}, 500, false);
        });
    }
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.query;
    const productTaken = (await productModel.getProductById(id)) || [];

    console.log(productTaken);
  } catch (err) {
    return res.status(500).send(err);
  }
  // const {
  //   name,
  //   price,
  //   description,
  //   stock,
  //   sizeId,
  //   stockSize,
  //   deliveryId,
  // } = req.body;

  // const sizes = sizeId.split(',');
  // const deliveries = deliveryId.split(',');

  // if (!productTaken) {
  //   responseStandard(res, 'product not found');
  // }

  // if (productTaken) {
  //   const updateProduct = await productModel.updateProduct(
  //     name,
  //     price,
  //     description,
  //     stock,
  //     productId,
  //   );

  //   if (updateProduct) {
  //     const productSizeTaken =
  //       (await productModel.getProductSize(productId)) || [];

  //     const productDeliverytaken =
  //       (await productModel.getProductDelivery(productId)) || [];

  //     if (productSizeTaken && productDeliverytaken) {
  //       const deleteProductSize = await productModel.deleteProductSize(
  //         productId,
  //       );

  //       const deleteProductDelivery = await productModel.deleteProductDelivery(
  //         productId,
  //       );

  //       if (deleteProductSize && deleteProductDelivery) {
  //         const createProductSize = await productModel.createProductSize(
  //           sizes,
  //           productId,
  //           stockSize,
  //         );

  //         if (createProductSize) {
  //           productModel
  //             .createProductDelivery(deliveries, productId)
  //             .then((result) => {
  //               responseStandard(res, 'product updated', {}, 200, true);
  //             })
  //             .catch((err) => {
  //               responseStandard(res, err, {}, 500, false);
  //             });
  //         }
  //       }
  //     }
  //   }
  // }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  productModel
    .getProduct(productId)
    .then((result) => {
      responseStandard(res, 'product deleted', {}, 204, true);
    })
    .catch((err) => {
      responseStandard(res, err, {}, 500, false);
    });
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
