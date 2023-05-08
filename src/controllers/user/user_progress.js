const { isAuthorized } = require("../../utils/auth-utils");

const userProgress = async (req, res) => {
  const {
    db: { User },
    params: { id },
  } = req;

  const progress = await User.userProgress(id);
  res.send(progress);
};

module.exports = userProgress;
