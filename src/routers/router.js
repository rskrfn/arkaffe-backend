const Router = require('express').Router();
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const { authentikasi } = require('../middlewares/authorization');

Router.use('/auth', authRouter);
Router.use('/product', productRouter);
Router.use('/cart', cartRouter);
Router.use('/profile', authentikasi, userRouter);

module.exports = Router;
