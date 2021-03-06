const cartModel = require('../models/cartModel');
const responseStandard = require('../helpers/response');

const createCart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { productId, quantity, sizeId } = req.body;

    if (!quantity || !sizeId) {
      responseStandard(res, 'Some field cannot be empty', {}, 400, false);
      return;
    }

    const createCart = await cartModel.addCart(userId);

    if (createCart) {
      const cartTaken = (await cartModel.getCartUser(userId)) || [];

      const index = cartTaken.length - 1;

      const cartId = cartTaken[index].id;

      await cartModel.addCartItem(cartId, productId, quantity, sizeId);

      responseStandard(res, 'Product added to cart'), {}, 200, true;
    }
  } catch (err) {
    console.log(err);
    responseStandard(res, err.message, {}, 500, false);
  }
};

const deletecart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { cartId, productId } = req.params;
    const results = await cartModel.getCartUser(userId);
    if (results) {
      return responseStandard(res, 'Cart item not found!!', {}, 404, false);
    }
    // const cartId = cartTaken[0].id;

    const deleteCartItem = await cartModel.deleteCartItem(cartId, productId);

    if (deleteCartItem) {
      return responseStandard(res, 'Product removed from cart', {}, 200, true);
    }
  } catch (err) {
    // console.log(err);
    responseStandard(res, err, {}, 500, false);
  }
};

const getCart = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const getCart = (await cartModel.getCart(userId)) || [];

    if (getCart.length < 1) {
      return responseStandard(res, 'Your cart is empty', {}, 400, false);
    }

    return responseStandard(res, 'Cart list', { getCart }, 200, true);
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  createCart,
  deletecart,
  getCart,
};
