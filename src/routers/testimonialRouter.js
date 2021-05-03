const Router = require('express').Router();
const testimonialHandler = require('../handlers/testimonialHandler');
const { isCustomer } = require('../middlewares/authorization');

Router.get('/', testimonialHandler.getAllReview);
Router.get('/:userId', testimonialHandler.getReview);
Router.post('/:userId', isCustomer, testimonialHandler.createReview);
Router.patch('/:userId', isCustomer, testimonialHandler.editReview);

module.exports = Router;
