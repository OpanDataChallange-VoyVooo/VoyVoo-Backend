/**
 * GET     /talants          ->  index
 * POST    /talants          ->
 * POST    /talants          ->
 * PUT     /talants          ->
 * DELETE  /talants          ->  destroy  (won't be implemented yet)
 */

/**
 * @description Talants Model
 * @param TalantModel
 */
const TalantModel = require("./model");
const { handleEntityNotFound, respondWithResult } = require("../common/util");

/**
 * @function index
 * @description Function that returns user info
 * @param {Object} req - Express Framework Request Object
 * @param {Object} res - Express Framework Response Object
 * @param {Object} next - Express Framework Response Object
 */

const index = (req, res, next) => {
  TalantModel.getTalantInfo(req)
    .then(handleEntityNotFound(req, "Talant not found"))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const portfolio = (req, res, next) => {
  TalantModel.portfolio(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const updateTalantInfo = (req, res, next) => {
  TalantModel.updateTalantInfo(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const updateTalantPic = (req, res, next) => {
  TalantModel.updateTalantPic(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const updateTalantMedia = (req, res, next) => {
  TalantModel.updateTalantMedia(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const post = (req, res, next) => {
  TalantModel.post(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

module.exports = {
  post,
  index,
  portfolio,
  updateTalantInfo,
  updateTalantPic,
  updateTalantMedia,
};
