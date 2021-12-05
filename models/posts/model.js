/**
 * @description Schema
 * @param schema
 */
const schema = require("./schemas");
const { validate } = require("../common/util");

const checkTalant = (req, talant_id) => {
  return req.pool.query(`SELECT id FROM users WHERE id=$1 AND is_talant;`, [
    talant_id,
  ]);
};

const checkPostType = (req, type_id) => {
  return req.pool.query(`SELECT id FROM request_types WHERE id=$1;`, [type_id]);
};

const getUserPosts = (req) => {
  const values = validate(req, schema.getUserPostsSchema, req.query);

  return req.pool.query(
    `SELECT 
      rt.name, pr.to, pr.from, p.media, p.posted_at 
    FROM 
      post_requests pr 
    JOIN
      request_types rt ON pr.type = rt.id
    JOIN
      posts p ON pr.id = p.response_to
    WHERE 
      pr.status = 'completed' AND pr.requested_to = $1 AND (NOT is_private OR pr.requested_by = $2)
    ORDER BY
      p.posted_at DESC
    LIMIT  $3
    OFFSET $4;`,
    [values.user_id, req.user.id, values.limit, values.offset]
  );
};

const requestPost = async (req) => {
  const values = validate(req, schema.requestPostSchema, req.body);
  const talantExists = await checkTalant(req, values.requested_to);
  if (talantExists.rowCount == 0) {
    req.statusCode = 404;
    throw new Error("No such talant available");
  }

  const checkPostTypeExists = await checkPostType(req, values.type_id);
  if (checkPostTypeExists.rowCount == 0) {
    req.statusCode = 404;
    throw new Error("No such 'Post Type' available");
  }

  return req.pool.query(
    `INSERT INTO post_requests (type, instruction, "to", "from", requested_to, requested_by, expires_at, is_private) VALUES ($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *;`,
    [
      values.type_id,
      values.instruction,
      values.to,
      values.from,
      values.requested_to,
      req.user.id,
      values.expires_at,
      values.is_private,
    ]
  );
};

module.exports = { getUserPosts, requestPost };
