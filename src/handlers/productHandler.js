const mysql = require('mysql');
const productModel = require('../models/productModel');
const responseStandard = require('../helpers/response');

const getProduct = async (req, res) => {
  try {
    const { baseUrl } = req;
    const { search, category, sort, limit, page } = req.query || '';

    const searchValue = `%${search || ''}%`;
    let sortValue = sort?.split('-') || null;
    let sortBy = null;
    let order = null;

    if (!sort) {
      sortValue = ['id', 'az'];
    }

    if (sortValue) {
      switch (sortValue[0].toLowerCase()) {
        case 'id':
          sortBy = mysql.raw('p.id');
          break;
        case 'price':
          sortBy = mysql.raw('p.price');
          break;
        default:
          sortBy = null;
          break;
      }

      order =
        sortValue[1]?.toLowerCase() === 'az'
          ? mysql.raw('ASC')
          : mysql.raw('DESC');
    }

    const pageNumber = Number(page) || 1;
    const limitPage = Number(limit) || 4;
    const offset = (pageNumber - 1) * limitPage;

    const productTaken =
      (await productModel.getProduct(
        searchValue,
        category,
        sortBy,
        order,
        limitPage,
        offset,
      )) || [];

    const totalPage = Math.ceil(productTaken.total / limitPage);

    const info = {
      total: productTaken.total,
      current_page: pageNumber,
      total_page: totalPage,
      next:
        pageNumber === totalPage
          ? null
          : `${baseUrl}?search=&category=${category}&sort=${sort}&page=${
              pageNumber + 1
            }&limit=${limitPage}`,
      prev:
        pageNumber === 1
          ? null
          : `${baseUrl}?search=&category=${category}&sort=${sort}&page=${
              pageNumber - 1
            }&limit=${limitPage}`,
    };

    return responseStandard(
      res,
      `${category} product list`,
      {
        data: productTaken.data,
        info,
      },
      200,
      true,
    );
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const createProduct = async (req, res) => {
  try {
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

    const { file } = req || {};
    let url = '';

    if (file.filename) {
      url = `/products/${file.filename}`;
    }

    if (
      !category ||
      !name ||
      !price ||
      !description ||
      !stock ||
      !startDelivery ||
      !endDelivery ||
      !sizeId ||
      !stockSize ||
      !deliveryId
    ) {
      responseStandard(res, 'some field canot be empty', {}, 400, false);
      return;
    }

    // console.log(file);
    // console.log(file.filename);
    // console.log(url);

    const product = {
      category_id: category,
      name,
      price: Number(price) || 0,
      description,
      stock,
      image_product: url,
      start_delivery: startDelivery,
      end_delivery: endDelivery,
    };

    const sizes = sizeId.split(',');
    const deliveries = deliveryId.split(',');

    const createProduct = await productModel.createProduct(product);
    if (!createProduct) {
      responseStandard(res, 'product failed to create', {}, 400, false);
      return;
    }

    const productTaken = (await productModel.getProductByName(name)) || [];

    if (!productTaken) {
      responseStandard(res, 'product not dount', {}, 404, false);
      return;
    }

    // console.log(productTaken);
    const productId = productTaken[0].id;

    const createProductSize = await productModel.createProductSize(
      sizes,
      productId,
      stockSize,
    );

    if (!createProductSize) {
      responseStandard(res, 'product failed to create', {}, 400, false);
      return;
    }

    const createProductDelivery = await productModel.createProductDelivery(
      deliveries,
      productId,
    );

    if (!createProductDelivery) {
      responseStandard(res, 'product failed to create', {}, 400, false);
      return;
    }

    return responseStandard(res, 'product created', {}, 200, true);
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      price,
      description,
      stock,
      sizeId,
      stockSize,
      deliveryId,
    } = req.body;

    const sizes = sizeId.split(',');
    const deliveries = deliveryId.split(',');

    const { file } = req || {};

    let url = '';

    if (file.filename) {
      url = `/products/${file.filename}`;
    }

    console.log(file);

    const productTaken = (await productModel.getProductById(productId)) || [];

    console.log(productTaken);

    if (!productTaken) {
      responseStandard(res, 'product not found', {}, 404, false);
      return;
    }

    const updateProduct = await productModel.updateProduct(
      name,
      price,
      description,
      stock,
      url,
      productId,
    );

    console.log(updateProduct);

    if (!updateProduct) {
      responseStandard(res, 'product failed to update');
      return;
    }

    const productSizeTaken =
      (await productModel.getProductSize(productId)) || [];
    console.log(productSizeTaken);

    const productDeliverytaken =
      (await productModel.getProductDelivery(productId)) || [];
    console.log(productDeliverytaken);

    const deleteProductSize = await productModel.deleteProductSize(productId);

    const deleteProductDelivery = await productModel.deleteProductDelivery(
      productId,
    );

    const createProductSize = await productModel.createProductSize(
      sizes,
      productId,
      stockSize,
    );

    const createProductDelivery = await productModel.createProductDelivery(
      deliveries,
      productId,
    );

    if (
      deleteProductSize &&
      deleteProductDelivery &&
      createProductSize &&
      createProductDelivery
    ) {
      return responseStandard(res, 'product updated', {}, 200, true);
    }
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deleteProduct = await productModel.deleteProduct(productId);
    const deleteProductSize = await productModel.deleteProductSize(productId);
    const deleteProductDelivery = await productModel.deleteProductDelivery(
      productId,
    );

    if (deleteProduct && deleteProductSize && deleteProductDelivery) {
      return responseStandard(res, 'product deleted', {}, 200, true);
    }
  } catch (err) {
    responseStandard(res, err, {}, 500, false);
  }
};

const getProductInfo = async (req, res) => {
  try {
    const { productId } = req.params;

    const productInfoTaken =
      (await productModel.getProductInfo(productId)) || [];

    if (productInfoTaken.length < 1) {
      responseStandard(res, 'product not found', {}, 404, false);
      return;
    }

    const productSizeTaken = (await productModel.getSizeInfo(productId)) || [];

    const productDeliveryTaken =
      (await productModel.getDeliveryInfo(productId)) || [];

    if (!productInfoTaken && !productSizeTaken && !productDeliveryTaken) {
      responseStandard(res, 'product not found', {}, 404, false);
    }

    const productInfo = {
      ...productInfoTaken[0],
      ...productSizeTaken[0],
      ...productDeliveryTaken[0],
    };

    if (productInfoTaken && productSizeTaken && productDeliveryTaken) {
      return responseStandard(
        res,
        'product information',
        { productInfo },
        200,
        true,
      );
    }
  } catch (err) {
    // console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductInfo,
};
