const express = require("express");
const userController = require("./controllers/user");
const addModels = require("./middleware/add-models");
const checkAuthentication = require("./middleware/check-authentication");

const Router = express.Router();
Router.use(addModels);

Router.get("/cookieCounter", (req, res) => {
  const { session } = req;
  console.log(session);
  session.viewCount = (session.viewCount || 0) + 1;
  console.log(session.viewCount);
  res.status(200).send({ count: session.viewCount });
});

// Create
Router.post("/users", userController.create);
Router.post("/users/login", userController.login);
Router.post("/users/questions", userController.createUsersStats);
Router.post("/users/stats", userController.checkUsersStats);
Router.post('/likeCount', userController.createLike);
Router.post("/likes", userController.likedList);


// Read
Router.get("/users", userController.list);
Router.get("/users/:id", userController.show);
Router.get("/me", userController.showMe);
Router.get("/users/:id/progress", userController.userProgress);


// Update
Router.patch("/users/:id", checkAuthentication, userController.update);

// Delete
Router.delete("/users/logout", userController.logout);

module.exports = Router;
