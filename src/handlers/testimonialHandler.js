const testimonialModel = require('../models/testimonialModel');
const responseStandard = require('../helpers/response');

const createReview = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { description, rating } = req.body;

    if (!description || !rating) {
      return responseStandard(
        res,
        'Some fields can not be empty',
        {},
        400,
        false,
      );
    }

    const testimonial = {
      users_id: userId,
      description,
      rating,
    };

    await testimonialModel.addTestimonial(testimonial);
    return responseStandard(res, 'Review submitted', {}, 200, true);
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

const editReview = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { description, rating } = req.body;

    await testimonialModel.editTestimonial(description, rating, userId);
    return responseStandard(res, 'Review updated', {}, 200, true);
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

const getReview = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviewTaken = (await testimonialModel.getTestimonial(userId)) || [];

    if (reviewTaken.length < 1) {
      return responseStandard(res, 'Data not found', {}, 404, false);
    }

    return responseStandard(res, 'Review details', { reviewTaken }, 200, true);
  } catch (err) {
    return responseStandard(res, err, {}, 500, false);
  }
};

const getAllReview = async (req, res) => {
  try {
    const getAllReview = (await testimonialModel.getAllTesimonial()) || [];
    return responseStandard(res, 'All review', { getAllReview }, 200, true);
  } catch (err) {
    console.log(err);
    return responseStandard(res, err, {}, 500, false);
  }
};

module.exports = {
  createReview,
  editReview,
  getReview,
  getAllReview,
};
