/**
 * @description Users Schema
 * @param users
 */
const users = require("./schemas");
const { validate } = require("../common/util");

const find = (req) => {
  const value = validate(req, users.idSchema, req.query);
  return req.pool.query(
    "SELECT id, f_name, l_name, m_name, username, is_talant, TO_CHAR(registered_at, 'YYYY-MM-DD HH24:MI:SS') AS registered_at FROM users WHERE id=$1;",
    [value.id]
  );
};

const check = (req) => {
  const value = validate(req, users.usernameSchema, req.params);
  return req.pool.query("SELECT id, username FROM users WHERE username=$1;", [
    value.username,
  ]);
};

const create = async (req) => {
  const value = validate(req, users.defaultSchema, req.body);
  req.params.username = value.username;
  const username = await check(req);
  if (username.rowCount > 0) {
    req.statusCode = 403;
    throw new Error("Username in use");
  }

  return req.pool.query(
    `INSERT INTO users (f_name, l_name, m_name, username, pwd) VALUES ($1, $2, $3, $4, $5) 
    RETURNING id, f_name, l_name, m_name, username, is_talant, TO_CHAR(registered_at, 'YYYY-MM-DD HH24:MI:SS') AS registered_at;`,
    [value.f_name, value.l_name, value.m_name, value.username, value.pwd]
  );
};

const login = (req) => {
  const value = validate(req, users.loginSchema, req.body);
  return req.pool.query(
    "SELECT id, f_name, l_name, m_name, username, is_talant, TO_CHAR(registered_at, 'YYYY-MM-DD HH24:MI:SS') AS registered_at FROM users WHERE username=$1 AND pwd=md5(md5(md5($2)));",
    [value.username, value.pwd]
  );
};

/**
 * @function buildUpdateQuery
 * @description util function for generating query for updating users table
 * @param values
 */
const buildUpdateQuery = (values) => {
  let query = ["UPDATE users", "SET"];
  let set = [];
  let id = values.id;
  delete values.id;
  delete values.pwd_verify;
  Object.keys(values).forEach((key, i) => {
    set.push(key + " = ($" + (i + 1) + ")");
  });
  query.push(set.join(", "));
  query.push("WHERE id = " + id);
  query.push("RETURNING id, f_name, l_name, m_name, username, is_talant;");
  return query.join(" ");
};

const buildUpdateParams = (values) => {
  delete values.id;
  delete values.pwd_verify;
  let colValues = Object.keys(values).map((key) => {
    return values[key];
  });
  return colValues;
};

const update = async (req) => {
  const value = validate(req, users.updateSchema, req.body);

  let keys = [];
  Object.keys(value).forEach((key) => {
    keys.push(key);
  });

  if (keys.length == 1) {
    req.statusCode = 400;
    throw new Error("At least one parametre is required");
  }

  if (value.username) {
    req.params.username = value.username;
    const username = await check(req);
    if (username.rowCount > 0 && username.rows[0].id != value.id) {
      req.statusCode = 403;
      throw new Error("Username in use");
    }
  }

  return req.pool.query(buildUpdateQuery(value), buildUpdateParams(value));
};

const verificationRequest = (req) => {
  const value = validate(req, users.verificationSchema, req.body);
  return req.pool.query(
    "INSERT INTO verification_requiest (user_id, link, contact) VALUES($1,$2,$3);",
    [req.user.id, value.link, value.contact]
  );
};

module.exports = { find, check, create, login, update, verificationRequest };
