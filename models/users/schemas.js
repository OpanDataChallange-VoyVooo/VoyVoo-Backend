const Joi = require("joi");
const usernamePattern = "^[a-zA-Z0-9_.]{1,20}$";
const pwdPattern = "^[\\w\\d_@./#&+-]{1,20}$";
const phonePattern = "^[+\\d]{13}$";

const idSchema = Joi.object({
  id: Joi.number().required(),
});

const usernameSchema = Joi.object({
  username: Joi.string().pattern(new RegExp(usernamePattern)).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().pattern(new RegExp(usernamePattern)).required(),
  pwd: Joi.string().pattern(new RegExp(pwdPattern)).required(),
});

const defaultSchema = Joi.object({
  f_name: Joi.string().required(),
  l_name: Joi.string().optional().allow("").default(null),
  m_name: Joi.string().optional().allow("").default(null),
  username: Joi.string().pattern(new RegExp(usernamePattern)).required(),
  pwd: Joi.string().pattern(new RegExp(pwdPattern)).required(),
});

const updateSchema = Joi.object({
  id: Joi.number().required(),
  f_name: Joi.string().optional(),
  l_name: Joi.string().optional(),
  m_name: Joi.string().optional(),
  username: Joi.string().pattern(new RegExp(usernamePattern)).optional(),
  pwd: Joi.string().pattern(new RegExp(pwdPattern)).optional(),
  pwd_verify: Joi.ref("pwd"),
}).with("pwd", "pwd_verify");

const verificationSchema = Joi.object({
  link: Joi.string().required(),
  contact: Joi.alternatives(
    Joi.string().email(),
    Joi.string().pattern(new RegExp(phonePattern))
  ).required(),
});

module.exports = {
  idSchema,
  usernameSchema,
  defaultSchema,
  loginSchema,
  updateSchema,
  verificationSchema,
};
