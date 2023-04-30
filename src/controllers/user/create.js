const createUser = async (req, res) => {
  const {
    session,
    db: { User },
    body: {
      username,
      password,
      email,
      first_name,
      last_name,
      gender,
      date_of_birth,
    },
  } = req;
  const user = await User.create(
    username,
    password,
    email,
    first_name,
    last_name,
    gender,
    date_of_birth
  );
  user
    ? res.status(201).send(user)
    : res.status(500).send({ err: "Can't create" });
  session.userId = user.id;
};

module.exports = createUser;
