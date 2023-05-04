const createLike = async (req, res) => {
  try {
    console.log(req.body); // check value of req.body
    const {
      session,
      db: { Like },
      body: { likee_id },
    } = req;
    const user = await Like.create(session.userId, likee_id);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
};

module.exports = createLike;
