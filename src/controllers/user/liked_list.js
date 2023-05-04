const User = require("../../db/models/user");

const listLiked = async (req, res) => {
  try {
    const {
      db: { Like },
      body: { id },
    } = req;

    const likeCount = await Like.showLikes(id);
    res.status(200).send(likeCount);
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = listLiked;