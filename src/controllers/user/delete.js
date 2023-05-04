const deleteLike = async (req, res) => {
  try {
    const {
      session,
      db: { Like },
      body: { id },
    } = req;
    const deleteLike = await Like.delete(session.userId, id);
    res.status(202).send(deleteLike);
  } catch(error) {
    console.error(error);
    return null;
  }
};

module.exports = deleteLike;
