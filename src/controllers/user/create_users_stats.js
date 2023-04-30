const createUsersStats = async (req, res) => {
    const {
        session,
        db: { UserStats },
        body:{
            user_id,
            weight, 
            height,
            bmi,
        },
    } = req
    const user_stats = await UserStats.create(
        user_id,
        weight,
        height,
        bmi,
    );
    user_stats 
    ? res.status(201).send(user_stats)
    : res.status(500).send({ err: "Can't create" });
    session.userId = user_stats.user_id; 
};

module.exports = createUsersStats;