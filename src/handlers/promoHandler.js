const mysql = require('mysql');
const promoModel = require('../models/promoModel');
const responseStandard = require('../helpers/response');

const getPromo = async (req, res) => {
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
      (await promoModel.getProduct(
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

const createPromo = async (req, res) => {
  try {
    const {
      name,
      normalPrice,
      description,
      discount,
      startExpired,
      endExpired,
      kuponCode,
      productId,
    } = req.body;

    const { file } = req || {};
    let url = '';

    if (file.filename) {
      url = `/promo/${file.filename}`;
    }

    if (
      !name ||
      !normalPrice ||
      !description ||
      !discount ||
      !startExpired ||
      !endExpired ||
      !kuponCode
    ) {
      responseStandard(res, 'Some field canot be empty', {}, 400, false);
      return;
    }

    // console.log(file);
    // console.log(file.filename);
    // console.log(url);

    const product = {
      name,
      normal_price: Number(normalPrice) || 0,
      description,
      discount,
      image_promo: url,
      start_expired: startExpired,
      end_expired: endExpired,
      kupon_code: kuponCode,
    };

    const createProduct = await promoModel.createProduct(product);
    if (!createProduct) {
      responseStandard(res, 'Product failed to create', {}, 400, false);
      return;
    }

    const productTaken = (await promoModel.getProductByName(name)) || [];

    if (!productTaken) {
      responseStandard(res, 'Product not found', {}, 404, false);
      return;
    }

    // console.log(productTaken);
    const promoId = productTaken[0].id;
    const promoProduct = {
      sizes,
      promoId,
      product_id: productId,
    };

    const createProductSize = await promoModel.createProductSize(promoProduct);

    if (!createProductSize) {
      responseStandard(res, 'Product failed to create', {}, 400, false);
      return;
    }

    return responseStandard(res, 'Product created', {}, 200, true);
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const updatePromo = async (req, res) => {
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

    const productTaken = (await promoModel.getProductById(productId)) || [];

    console.log(productTaken);

    if (!productTaken) {
      responseStandard(res, 'Product not found', {}, 404, false);
      return;
    }

    const updateProduct = await promoModel.updateProduct(
      name,
      price,
      description,
      stock,
      url,
      productId,
    );

    console.log(updateProduct);

    if (!updateProduct) {
      responseStandard(res, 'Product failed to update');
      return;
    }

    const productSizeTaken = (await promoModel.getProductSize(productId)) || [];
    console.log(productSizeTaken);

    const productDeliverytaken =
      (await promoModel.getProductDelivery(productId)) || [];
    console.log(productDeliverytaken);

    const deleteProductSize = await promoModel.deleteProductSize(productId);

    const deleteProductDelivery = await promoModel.deleteProductDelivery(
      productId,
    );

    const createProductSize = await promoModel.createProductSize(
      sizes,
      productId,
      stockSize,
    );

    const createProductDelivery = await promoModel.createProductDelivery(
      deliveries,
      productId,
    );

    if (
      deleteProductSize &&
      deleteProductDelivery &&
      createProductSize &&
      createProductDelivery
    ) {
      return responseStandard(res, 'Product updated', {}, 200, true);
    }
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const deletePromo = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleteProduct = await promoModel.deleteProduct(productId);
    const deleteProductSize = await promoModel.deleteProductSize(productId);
    const deleteProductDelivery = await promoModel.deleteProductDelivery(
      productId,
    );
    if (deleteProduct && deleteProductSize && deleteProductDelivery) {
      return responseStandard(res, 'Product deleted', {}, 200, true);
    }
  } catch (err) {
    responseStandard(res, err, {}, 500, false);
  }
};

const getPromoInfo = async (req, res) => {
  try {
    const { productId } = req.params;

    const productInfoTaken = (await promoModel.getProductInfo(productId)) || [];

    if (productInfoTaken.length < 1) {
      responseStandard(res, 'Product not found', {}, 404, false);
      return;
    }

    const productSizeTaken = (await promoModel.getSizeInfo(productId)) || [];

    const productDeliveryTaken =
      (await promoModel.getDeliveryInfo(productId)) || [];

    if (!productInfoTaken && !productSizeTaken && !productDeliveryTaken) {
      responseStandard(res, 'Product not found', {}, 404, false);
    }

    const productInfo = {
      ...productInfoTaken[0],
      ...productSizeTaken[0],
      ...productDeliveryTaken[0],
    };

    if (productInfoTaken && productSizeTaken && productDeliveryTaken) {
      return responseStandard(
        res,
        'Product information',
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
  getPromo,
  createPromo,
  updatePromo,
  deletePromo,
  getPromoInfo,
};
