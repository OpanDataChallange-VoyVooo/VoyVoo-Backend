const Joi = require("joi");

const getUserPostsSchema = Joi.object({
  user_id: Joi.number().min(0).required(),
  limit: Joi.number().min(0).default(10).max(20),
  offset: Joi.number().min(0).default(0),
});

const requestPostSchema = Joi.object({
  type_id: Joi.number().min(0).required(),
  instruction: Joi.string().required(),
  to: Joi.string().max(255).required(),
  from: Joi.string().max(255).required(),
  requested_to: Joi.number().min(0).required(),
  expires_at: Joi.string().required(),
  is_private: Joi.boolean().default(false),
});

module.exports = { requestPostSchema, getUserPostsSchema };
