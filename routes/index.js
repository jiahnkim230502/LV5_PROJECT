const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.routes.js");
const usersRouter = require("./users.routes.js");

router.use("/posts", postsRouter);
router.use("/", usersRouter);

module.exports = router;