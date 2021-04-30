const Router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const { authentikasi } = require('../middlewares/authorization');

Router.use('/auth', authRouter);
Router.use('/profile', authentikasi, userRouter);
Router.use('/product', productRouter);
Router.use('/cart', cartRouter);

module.exports = Router;
