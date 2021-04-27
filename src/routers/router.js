const Router = require('express').Router();
const authRouter = require('./authRouter');

Router.use('/auth', authRouter);

module.exports = Router;
