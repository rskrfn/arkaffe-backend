const cartModel = require('../models/cartModels');
const responseStandard = require('../helpers/response');

const createCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, sizeId } = req.body;

    if (!quantity || !sizeId) {
      responseStandard(res, 'some field cannot be empty', {}, 400, false);
      return;
    }

    const createCart = await cartModel.addCart(userId);

    const cartTaken = await cartModel.getCartUser(userId);

    const index = cartTaken.length - 1;

    const cartId = cartTaken[index].id;
    // console.log(cartTaken);
    // console.log(cartId);

    const createCartItem = await cartModel.addCartItem(
      cartId,
      productId,
      quantity,
      sizeId,
    );

    if (createCart && createCartItem) {
      return responseStandard(res, 'product added to cart', {}, 200, true);
    }
  } catch (err) {
    // console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const deletecart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const deleteCart = await cartModel.deleteCart(userId);
    const deleteCartItem = await cartModel.deleteCartItem(productId);

    if (deleteCart && deleteCartItem) {
      return responseStandard(res, 'product removed from cart', {}, 200, true);
    }
  } catch (err) {
    // console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  createCart,
  deletecart,
};
