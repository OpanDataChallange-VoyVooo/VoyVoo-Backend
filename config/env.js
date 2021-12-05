module.exports = {
  APP: {
    PORT: process.env.APP_PORT,
    SECRET: process.env.SECRET,
    SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT),
    ENV: process.env.NODE_ENV,
    SPACES_ACCESS_KEY_ID: process.env.SPACES_ACCESS_KEY_ID,
    SPACES_SECRET_ACCESS_KEY: process.env.SPACES_SECRET_ACCESS_KEY,
    SPACES_REGION: process.env.SPACES_REGION,
  },

  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    APPLICATION_NAME: process.env.APPLICATION_NAME,
  },
};
