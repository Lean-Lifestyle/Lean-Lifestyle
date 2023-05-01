const createUsersStats = async (req, res) => {
  const {
    session,
    db: { UserStats },
    body: {
      user_id,
      weight,
      height,
      bmi,
      activity_level,
      target_weight,
      target_duration,
    },
  } = req;
  const user_stats = await UserStats.create(
    user_id,
    weight,
    height,
    bmi,
    activity_level
  );
  await UserStats.createUserTarget(user_id, target_weight, target_duration);
  user_stats
    ? res.status(201).send(user_stats)
    : res.status(500).send({ err: "Can't create" });
  session.userId = user_stats.user_id;
};

module.exports = createUsersStats;
