const checkLike = async (req, res) => {
  try {
    const {
      session,
      db: { Like },
      body: { id },
    } = req;
    const like = await Like.didLike(session.userId, id);
    res.send(like);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = checkLike;
