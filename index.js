"use strict";
const startTime = new Date();
const dotenv = require("dotenv-safe");
dotenv.config({
  path: `.env`,
  sample: `.env.example`,
  allowEmptyValues: false,
});

const app = require("./app");
const auth = require("./middlewares/auth");

app.get("/uptime", (req, res) => {
  const uptime = `${new Date() - startTime}ms`;
  res.send({ startTime, uptime });
});

const users = require("./models/users");
const talant = require("./models/talants");
const posts = require("./models/posts");
const main = require("./models/main");

app.use("/users", users);
app.use("/talant", auth, talant);
app.use("/posts", auth, posts);
app.use("/main", main);

app.use((req, res) => {
  res.send({ status: 404, message: "Not found" });
});

/**
 * @description Express error handler
 */
app.use((err, req, res, next) => {
  let status = req.statusCode > 200 ? req.statusCode : 500;
  res.send({
    status,
    message: err.message,
    err: process.env.NODE_ENV == "development" ? err.stack : {},
  });
});
