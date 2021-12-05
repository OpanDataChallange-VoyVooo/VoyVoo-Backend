const Model = require("./model");
const { handleEntityNotFound, respondWithResult } = require("../common/util");

const getUserPosts = (req, res, next) => {
  Model.getUserPosts(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

const createPostRequest = (req, res, next) => {
  Model.requestPost(req)
    .then(handleEntityNotFound(req))
    .then(respondWithResult(res))
    .catch((e) => next(e));
};

module.exports = { getUserPosts, createPostRequest };
