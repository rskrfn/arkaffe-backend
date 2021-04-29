const Router = require('express').Router();
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');

Router.use('/auth', authRouter);
Router.use('/product', productRouter);

module.exports = Router;
