const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.routes.js");
const usersRouter = require("./users.routes.js");
const commentRouter = require("./comments.routes.js");
const likeRouter = require("./likes.routes.js");

router.use("/posts", [postsRouter, commentRouter, likeRouter]);
router.use("/", usersRouter);

module.exports = router;