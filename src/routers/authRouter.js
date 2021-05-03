const Router = require('express').Router();
const authHandler = require('../handlers/authHandler');

// auth
Router.post('/register', authHandler.Register);
Router.post('/login', authHandler.Login);
Router.post('/logout', authHandler.logout);

module.exports = Router;
