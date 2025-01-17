const { isAuthorized } = require("../../utils/auth-utils");

const updateUser = async (req, res) => {
  const {
    session,
    db: { User },
    params: { id },
    body: { weight },
  } = req;

  if (!isAuthorized(id, session)) return res.sendStatus(403);

  const user = await User.find(id);
  if (!user) return res.sendStatus(404);

  const updatedWeight = await user.updateWeight(weight);
  res.send(updatedWeight);
};

module.exports = updateUser;
