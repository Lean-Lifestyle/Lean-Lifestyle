const likerList = async (req, res) => {
  const {
    db: { Like },
    body: { id },
  } = req;
  const likers = await Like.whoLiked(id);
  res.send(likers);
};

module.exports = likerList;

