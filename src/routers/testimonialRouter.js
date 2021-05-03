const Router = require('express').Router();
const testimonialHandler = require('../handlers/testimonialHandler');
const { authentikasi } = require('../middlewares/authentication');
const { isCustomer } = require('../middlewares/authorization');

Router.get('/', testimonialHandler.getAllReview);
Router.get('/:userId', testimonialHandler.getReview);
Router.post('/give', authentikasi, isCustomer, testimonialHandler.createReview);
Router.patch('/edit', authentikasi, isCustomer, testimonialHandler.editReview);

module.exports = Router;
