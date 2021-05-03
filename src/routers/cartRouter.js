const Router = require('express').Router();
const cartHandler = require('../handlers/cartHandler');

Router.post('/:userId/:productId', cartHandler.createCart);
Router.delete('/:userId/:productId', cartHandler.deletecart);
Router.get('/:userId', cartHandler.getCart);

module.exports = Router;
