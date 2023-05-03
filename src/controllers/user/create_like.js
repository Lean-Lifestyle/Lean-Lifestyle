const createLike = async (req, res) => {
    const {
        session,
        db: { Like },
        body: {
            liker_id,
            likee_id
        },
    } = req;
    try {
        const user = await Like.create(
            session.userId,
            
        );
        res.status(201).send(user);
    }catch(error){
        console.log(error)
        res.status(500).send({ error: "Server error" });
    }
}

module.exports = createLike;