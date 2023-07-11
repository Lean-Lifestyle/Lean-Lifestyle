const express = require("express");
const cookieSession = require("cookie-session");

const Router = express.Router();

Router.use(
  cookieSession({
    secret: 'db8c3cffebb2159b46ee38ded600f437ee080f8605510ee360758f6976866e00d603d9b3399341b0cd37dfb8e599fff3',
    // By default, the cookie's lifetime is "session"
    // which means until we close the browser. We like this for now!
    // But in real life you'd set the cookie to expire,
    // and implement an auto re-auth flow, but that's too much at this point.

//     maxAge: 1000 * 60 * 60 * 24  // 24 hours
  })
);

module.exports = Router;
