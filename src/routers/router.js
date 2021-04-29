const Router = require('express').Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const { authentikasi } = require('../middlewares/authorization');

Router.use('/auth', authRouter);
Router.use('/profile', authentikasi, userRouter);

module.exports = Router;
