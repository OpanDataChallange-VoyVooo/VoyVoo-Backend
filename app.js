/**
 * @description Configuration environment variables
 */
const { DB, APP } = require("./config/env");
const corsOptions = {
  exposedHeaders: "token",
};

const { Pool } = require("pg");
const express = require("express");
const app = express();
const pool = new Pool(DB);

const helmet = require("helmet");
const cors = require("cors");
const Ddos = require("ddos");
const ddos = new Ddos({ burst: 4, limit: 10, maxexpiry: 60 });
const bodyParser = require("body-parser");

app.use(ddos.express);
app.use(helmet());

app.use(cors(corsOptions));

const shouldParseRequest = (req) => {
  return !req.is("multipart/form-data");
};
const parseJSON = bodyParser.json();
app.use((req, res, next) =>
  shouldParseRequest(req) ? parseJSON(req, res, next) : next()
);

app.use((req, res, next) => {
  pool.query(`SELECT 1 + 1 AS num`, (err) => {
    if (err) {
      req.statusCode = 500;
      next(err);
    }
    req.pool = pool;
    next();
  });
});

/**
 * @function startServer
 * @description Start API Server
 */
const startServer = () => {
  app.listen(APP.PORT, "0.0.0.0", () => {
    console.log("%s server started on port %s", APP.ENV, APP.PORT);
  });
};

/**
 * @description Starting API Server after everythin is set up
 */
setImmediate(startServer);

/**
 * @description Application object
 * @module app
 */

module.exports = app;
