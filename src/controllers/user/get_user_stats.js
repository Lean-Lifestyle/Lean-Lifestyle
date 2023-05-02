const getUserStats = async (req, res) => {
    const {session, db : { UserStats },} = req;
    const user_stats = await UserStats.getUserStats(session.userId);
    console.log(user_stats);
    user_stats
        ? res.status(201).send(user_stats)
        : res.status(500).send({ err: "Can't get stats from User" });
};
 


module.exports = getUserStats;