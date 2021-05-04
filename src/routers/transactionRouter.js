const Router = require('express').Router();
const transactionHandler = require('../handlers/transactionHandler');
const { isCustomer } = require('../middlewares/authorization');

Router.post('/:cartId', isCustomer, transactionHandler.addTransaction);
Router.patch('/:cartId', isCustomer, transactionHandler.updateTransaction);

module.exports = Router;
