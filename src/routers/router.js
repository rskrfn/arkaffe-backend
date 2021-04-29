const Router = require('express').Router();
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');

Router.use('/auth', authRouter);
Router.use('/product', productRouter);
Router.use('/cart', cartRouter);

module.exports = Router;
