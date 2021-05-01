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

    const createCart = await cartModel.addCart(userId);

    if (createCart) {
      const cartTaken = (await cartModel.getCartUser(userId)) || [];

      const index = cartTaken.length - 1;

      const cartId = cartTaken[index].id;

      cartModel.addCartItem(cartId, productId, quantity, sizeId);

      responseStandard(res, 'product added to cart'), {}, 200, true;
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
