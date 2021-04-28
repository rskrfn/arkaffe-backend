const Router = require('express').Router();
const authHandler = require('../handlers/authHandler');

// auth
Router.post('/register', authHandler.Register);

module.exports = Router;
