const User = require("../../db/models/user");

const listLiked = async (req, res) => {
    // const { Like } = req.db;
    // const likes = await Like.list();
    // res.send(likes);
    const {
        db: { Like },
        params: {
            id
        }
    } = req;
    
}

module.exports = listLiked;