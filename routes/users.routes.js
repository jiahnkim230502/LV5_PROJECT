const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller.js");
const usersController = new UsersController();

router.post("/signup", usersController.createUser);

module.exports = router;