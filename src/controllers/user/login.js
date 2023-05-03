const loginUser = async (req, res) => {
  const {
    session,
    db: { User },
    body: { username, password },
  } = req;

  const user = await User.findByUsername(username);
  if (!user) return res.status(404).send("User not found");

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) return res.status(401).send("Invalid password");

  session.userId = user.id;
  res.send(user);
};

module.exports = loginUser;
