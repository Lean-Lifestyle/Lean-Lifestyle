const checkUsersStats = async (req, res) => {
  const {
    db: { UserStats },
    body: { user_id },
  } = req;
  const userStats = await UserStats.getUserStats(user_id);
  if (userStats) {
    res.status(201).send(userStats);
  } else {
    res.status(500).send({ err: "Can't create" });
  }
};

module.exports = checkUsersStats;
