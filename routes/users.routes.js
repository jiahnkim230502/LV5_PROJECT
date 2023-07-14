const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller.js");
const usersController = new UsersController();

router.get("/users/:userId", usersController.getUser);
router.post("/signup", usersController.createUser);
router.post("/login", usersController.loginUser);

module.exports = router;