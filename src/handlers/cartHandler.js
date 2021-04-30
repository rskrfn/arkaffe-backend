const cartModel = require('../models/cartModel');
const responseStandard = require('../helpers/response');

const createCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity, sizeId } = req.body;

    if (!quantity || !sizeId) {
      responseStandard(res, 'some field cannot be empty', {}, 400, false);
      return;
    }

    const cartTaken = (await cartModel.getCartUser(userId)) || [];

    if (cartTaken.length < 1) {
      const createCart = await cartModel.addCart(userId);

      const taken = (await cartModel.getCartUser(userId)) || [];
      const cartId = taken[0].id;

      const createCartItem = await cartModel.addCartItem(
        cartId,
        productId,
        quantity,
        sizeId,
      );

      if (createCart && createCartItem) {
        return responseStandard(res, 'product added to cart', {}, 200, true);
      }
    }

    if (cartTaken.length > 0) {
      const cartId = cartTaken[0].id;
      const createCartItem = await cartModel.addCartItem(
        cartId,
        productId,
        quantity,
        sizeId,
      );

      if (createCartItem) {
        return responseStandard(res, 'product added to cart', {}, 200, true);
      }
    }
  } catch (err) {
    console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const deletecart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cartTaken = (await cartModel.getCartUser(userId)) || [];
    const cartId = cartTaken[0].id;

    const deleteCartItem = await cartModel.deleteCartItem(cartId, productId);

    if (deleteCartItem) {
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
