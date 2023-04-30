const User = require("../db/models/user");
const UserStats = require("../db/models/users_stats");

const addModels = (req, res, next) => {
  req.db = {
    User,
    UserStats,
  };
  next();
};

module.exports = addModels;
