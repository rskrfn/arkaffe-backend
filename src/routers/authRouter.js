const Router = require('express').Router();
const authHandler = require('../handlers/auth');

Router.post('/login', authHandler.login);

module.exports = Router;
