const createUser = async (req, res) => {
  const {
    session,
    db: { User },
    body: { username, password, email, first_name, last_name, gender, date_of_birth },
  } = req;

  const user = await User.create(username, password, email, first_name, last_name, gender, date_of_birth);
  session.userId = user.id;

  res.send(user);
};

module.exports = createUser;
