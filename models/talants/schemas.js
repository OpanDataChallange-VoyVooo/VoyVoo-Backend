const Joi = require("joi");

const portfolio = Joi.object({
  title: Joi.string().required(),
});

const updateProfilePicture = Joi.object({
  profile_pic: Joi.string().required(),
});

const updateProfileIntoro = Joi.object({
  intro_media: Joi.string().required(),
});

const updateTalantInfo = Joi.object({
  description: Joi.string().optional(),
  request_price: Joi.number().optional(),
  category_id: Joi.number().optional(),
});

const post = Joi.object({
  response_to: Joi.number().min(0).required(),
});

module.exports = {
  post,
  portfolio,
  updateTalantInfo,
  updateProfilePicture,
  updateProfileIntoro,
};
