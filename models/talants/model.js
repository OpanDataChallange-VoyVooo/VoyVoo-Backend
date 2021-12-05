/**
 * @description Talants Schema
 * @param talants
 */

const talants = require("./schemas");
const { validate } = require("../common/util");
const { unlink } = require("../../middlewares/aws_uploader");

const getTalantInfo = (req) => {
  return req.pool.query("SELECT * FROM talants WHERE user_id = $1;", [
    req.user.id,
  ]);
};

const portfolio = (req) => {
  if (!req.file) {
    req.statusCode = 400;
    throw new Error("'file' required");
  }

  try {
    validate(req, talants.portfolio, req.body);
  } catch (error) {
    unlink(req.file.key);
    throw error;
  }

  return req.pool.query(
    `INSERT INTO portfolios (title, talant_id, media, media_content) VALUES ($1,$2,$3,$4) RETURNING *;`,
    [req.body.title, req.user.id, req.file.key, req.file.contentType]
  );
};

/**
 * @function buildUpdateQuery
 * @description util function for generating query for updating talants table
 * @param values
 */
const buildUpdateQuery = (values, id) => {
  let query = ["UPDATE talants", "SET"];
  let set = [];

  Object.keys(values).forEach((key, i) => {
    set.push(key + " = ($" + (i + 1) + ")");
  });
  query.push(set.join(", "));
  query.push("WHERE user_id = " + id);
  query.push("RETURNING *");
  return query.join(" ");
};

const buildUpdateParams = (values) => {
  let colValues = Object.keys(values).map((key) => {
    return values[key];
  });
  return colValues;
};

const updateTalantInfo = (req) => {
  const value = validate(req, talants.updateTalantInfo, req.body);

  let keys = [];
  Object.keys(value).forEach((key) => {
    keys.push(key);
  });

  if (keys.length == 0) {
    req.statusCode = 400;
    throw new Error("At least one parametre is required");
  }

  return req.pool.query(
    buildUpdateQuery(value, req.user.id),
    buildUpdateParams(value)
  );
};

const updateTalantPic = (req) => {
  if (!req.file) {
    req.statusCode = 400;
    throw new Error("'file' required");
  }
  return req.pool.query(
    `UPDATE talants SET profile_pic = $1, profile_pic_content = $2 WHERE user_id = $3 RETURNING profile_pic, profile_pic_content;`,
    [req.file.key, req.file.contentType, req.user.id]
  );
};

const updateTalantMedia = (req) => {
  if (!req.file) {
    req.statusCode = 400;
    throw new Error("'file' required");
  }
  return req.pool.query(
    `UPDATE talants SET intro_media = $1, intro_media_content = $2  WHERE user_id = $3 RETURNING intro_media, intro_media_content;`,
    [req.file.key, req.file.contentType, req.user.id]
  );
};

const checkRequest = async (req) => {
  return req.pool.query(
    `SELECT id FROM post_requests WHERE id = $1 AND requested_to = $2;`,
    [req.body.response_to, req.user.id]
  );
};

const post = async (req) => {
  if (!req.file) {
    req.statusCode = 400;
    throw new Error("'file' required");
  }

  try {
    validate(req, talants.post, req.body);
  } catch (error) {
    unlink(req.file.key);
    throw error;
  }

  const request = await checkRequest(req);
  if (request.rowCount == 0) {
    unlink(req.file.key);
    req.statusCode = 409;
    throw new Error("Not allowed");
  }

  return req.pool.query(
    `INSERT INTO posts (media, posted_by, response_to, media_content) VALUES($1,$2,$3,$4) RETURNING *;`,
    [req.file.key, req.user.id, req.body.response_to, req.file.contentType]
  );
};

module.exports = {
  post,
  getTalantInfo,
  portfolio,
  updateTalantInfo,
  updateTalantPic,
  updateTalantMedia,
};
