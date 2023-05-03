const User = require("../db/models/user");
const UserStats = require("../db/models/users_stats");
const Like = require("../db/models/like");

const addModels = (req, res, next) => {
  req.db = {
    User,
    UserStats,
    Like,
  };
  next();
};

module.exports = addModels;
