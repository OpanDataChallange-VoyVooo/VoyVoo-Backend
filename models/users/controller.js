/**
 * GET     /users/?id=         ->  index
 * GET     /users/:username    ->  checkUsername
 * POST    /users              ->  create
 * POST    /users/login        ->  login
 * POST    /users/verify       ->  verificationRequest
 * PUT     /users/:id          ->  update
 * DELETE  /users/:id          ->  destroy  (won't be implemented yet)
 */

/**
 * @description Users Model
 * @param UserModel
 */
const UserModel = require("./model");
const { handleEntityNotFound, respondWithResult } = require("../common/util");

const jwt = require("jsonwebtoken");
const { APP } = require("../../config/env");

/**
 * @function index
 * @description Function that returns user info
 * @param {Object} req - Express Framework Request Object
 * @param {Object} res - Express Framework Response Object
 * @param {Object} next - Express Framework Response Object
 */
const index = (req, res, next) => {
  UserModel.find(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((err) => {
      next(err);
    });
};

/**
 * @function checkUsername
 * @description Checks if username in use
 * @param {Object} req - Express Framework Request Object
 * @param {Object} res - Express Framework Response Object
 * @param {Object} next - Express Framework Response Object
 */
const checkUsername = (req, res, next) => {
  UserModel.check(req)
    .then(handleEntityNotFound(req, "User not found"))
    .then(respondWithResult(res))
    .catch((err) => {
      next(err);
    });
};

/**
 * @function create
 */
const create = (req, res, next) => {
  UserModel.create(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((err) => {
      next(err);
    });
};

/**
 * @function login
 * @param {Object} req Express object
 * @param {Object} res Express object
 * @param {Object} next Express object
 */
const login = (req, res, next) => {
  UserModel.login(req)
    .then(handleEntityNotFound(req, "User not found"))
    .then((result) => {
      const { id, username, is_talant } = result.rows[0];
      let token = jwt.sign({ id, username, is_talant }, APP.SECRET, {
        expiresIn: APP.SESSION_TIMEOUT,
        algorithm: "HS384",
      });
      res.setHeader("token", token);
      return result;
    })
    .then(respondWithResult(res))
    .catch((e) => {
      next(e);
    });
};

const update = (req, res, next) => {
  UserModel.update(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const verificationRequest = (req, res, next) => {
  if (req.user.is_talant) {
    req.statusCode = 409;
    throw new Error("Not allowed for talants");
  }

  UserModel.verificationRequest(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => {
      if (e.message.includes("duplicate")) {
        req.statusCode = 409;
        e.message = "Verification request already exists";
      }
      next(e);
    });
};

module.exports = {
  index,
  checkUsername,
  create,
  login,
  update,
  verificationRequest,
};
