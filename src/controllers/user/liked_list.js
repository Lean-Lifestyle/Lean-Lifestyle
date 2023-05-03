const listLiked = async (req, res) => {
    const { Like } = req.db;
    const likes = await Like.list();
    res.send(likes);
}

module.exports = listLiked;