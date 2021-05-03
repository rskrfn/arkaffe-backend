const Router = require('express').Router();
const testimonialHandler = require('../handlers/testimonialHandler');

Router.get('/:userId', testimonialHandler.getReview);
Router.post('/:userId', testimonialHandler.createReview);
Router.patch('/:userId', testimonialHandler.editReview);

module.exports = Router;
