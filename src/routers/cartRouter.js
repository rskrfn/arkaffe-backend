const Router = require('express').Router();
const cartHandler = require('../handlers/cartHandler');
const { isCustomer } = require('../middlewares/authorization');

Router.post('/add', isCustomer, cartHandler.createCart);
Router.get('/', isCustomer, cartHandler.getCart);
Router.delete('/delete/:cartId/:productId', isCustomer, cartHandler.deletecart);

module.exports = Router;
