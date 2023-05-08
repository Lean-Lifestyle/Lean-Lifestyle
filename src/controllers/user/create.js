const createUser = async (req, res) => {
  const {
    session,
    db: { User },
    body: {
      username,
      password,
      email,
      gender,
      date_of_birth,
    },
  } = req;
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).send({ error: "Username already taken" });
    } else {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(409).send({ error: "Email already taken" });
      } else {
        const user = await User.create(
          username,
          password,
          email,
          gender,
          date_of_birth
        );
        session.userId = user.id;
        res.status(201).send(user);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = createUser;
