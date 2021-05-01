const Router = require('express').Router();
const transactionHandler = require('../handlers/transactionHandler');

Router.post('/:cartId', transactionHandler.addTransaction);

module.exports = Router;
