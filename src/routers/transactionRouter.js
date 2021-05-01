const Router = require('express').Router();
const transactionHandler = require('../handlers/transactionHandler');

Router.post('/:cartId', transactionHandler.addTransaction);
Router.patch('/:cartId', transactionHandler.updateTransaction);

module.exports = Router;
