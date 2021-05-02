const Router = require('express').Router();
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const userRouter = require('./userRouter');
const customerRouter = require('./customerRouter');
const staffRouter = require('./staffRouter');
const transactionRouter = require('./transactionRouter');
const { isStaff, isCustomer } = require('../middlewares/authorization');
const { authentikasi } = require('../middlewares/authentication');

Router.use('/auth', authRouter);
Router.use('/customer', authentikasi, isCustomer);
Router.use('/staff', authentikasi, isStaff);
Router.use('/product', productRouter);
Router.use('/cart', cartRouter);
Router.use('/profile', authentikasi, userRouter);
Router.use('/transaction', transactionRouter);

module.exports = Router;
