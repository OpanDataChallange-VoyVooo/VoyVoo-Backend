const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { APP } = require("../config/env");
const { v5 } = require("uuid");

aws.config.update({
  accessKeyId: APP.SPACES_ACCESS_KEY_ID,
  secretAccessKey: APP.SPACES_SECRET_ACCESS_KEY,
  region: APP.SPACES_REGION,
});

const spacesEndpoint = new aws.Endpoint("fra1.digitaloceanspaces.com");
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

// Change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "voyvoo",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      let path =
        req.originalUrl.charAt(req.originalUrl.length - 1) == "/"
          ? req.originalUrl.slice(1, -1)
          : req.originalUrl.slice(1);
      let d = new Date().getTime().toString();
      let cdn_path = `${req.user.id}/${path}/${v5(d, v5.URL)}`;
      cb(null, `${cdn_path}`);
    },
  }),
}).single("file");

module.exports.aws_uploader = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) return next(error);
    next();
  });
};

module.exports.unlink = (path) => {
  s3.deleteObject(
    {
      Bucket: "voyvoo",
      Key: path,
    },
    (err) => {
      if (err) console.log(err);
    }
  );
};
