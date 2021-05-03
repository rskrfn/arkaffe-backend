const Router = require('express').Router();
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const transactionRouter = require('./transactionRouter');
const testimonialRouter = require('../routers/testimonialRouter');
const { authentikasi } = require('../middlewares/authentication');

Router.use('/auth', authRouter);
Router.use('/product', productRouter);
Router.use('/cart', authentikasi, cartRouter);
Router.use('/profile', authentikasi, userRouter);
Router.use('/transaction', authentikasi, transactionRouter);
Router.use('/testimonial', authentikasi, testimonialRouter);

module.exports = Router;
