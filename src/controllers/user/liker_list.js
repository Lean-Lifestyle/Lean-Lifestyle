const likerList = async (req, res) => {
  const {
    db: { Like },
    body: { id },
  } = req;
  console.log(id);
  const likers = await Like.whoLiked(id);
  console.log(likers);
  res.send(likers);
};

module.exports = likerList;

