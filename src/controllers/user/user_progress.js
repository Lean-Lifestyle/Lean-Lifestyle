const { isAuthorized } = require("../../utils/auth-utils");

const userProgress = async (req, res) => {
  const {
    session,
    db: { User },
    params: { id },
  } = req;

  if (!isAuthorized(id, session)) return res.sendStatus(403);

  const user = await User.find(id);
  if (!user) return res.sendStatus(404);

  const progress = await user.userProgress();
  res.send(progress);
};

module.exports = userProgress;
