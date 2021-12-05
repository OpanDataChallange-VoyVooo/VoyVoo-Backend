/**
 * @function handleEntityNotFound
 * @description Function that handle entity not found respond
 * @param {Object} req - Express Framework Response Object
 */
const handleEntityNotFound = (req, message = "Not found") => {
  return (result) => {
    if (result.rowCount == 0) {
      req.statusCode = 404;
      throw Error(message);
    }
    return result;
  };
};

/**
 * @function respondWithResult
 * @description Function that returns response with data
 * @param {Object} res - Express Framework Response Object
 */
const respondWithResult = (res) => {
  return (result) => {
    if (result) {
      return res.send({ status: 200, data: result.rows });
    }
  };
};

/**
 * @function validate
 * @description Function that validates request body
 * @param {Object} req - Express Framework Request Object
 * @param schema - Joi object
 * @param body - Body to be validated
 */
const validate = (req, schema, body) => {
  const { error, value } = schema.validate(body);
  req.statusCode = error ? 400 : req.statusCode;
  if (error)
    throw Error(
      error.details[0].type == "string.pattern.base"
        ? error.details[0].message.split(":")[0]
        : error.details[0].message
    );
  return value;
};

module.exports = { handleEntityNotFound, respondWithResult, validate };
