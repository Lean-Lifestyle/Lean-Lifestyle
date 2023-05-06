const uploadImage = async (req, res) => {
  try {
    const {
      session,
      db: { User },
      body: { image },
    } = req;
    console.log(session.userId, image);
    const result = await User.uploadImage(session.userId, image);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const sendImage = async (req, res) => {
  try {
    const {
      db: { User },
      body: { id },
    } = req;
    const result = await User.sendImage(id);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  uploadImage,
  sendImage,
};
