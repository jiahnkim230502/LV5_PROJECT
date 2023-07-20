const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = require("../controllers/comments.controller");
const commentRepository = new CommentController();

router.get("/:postId/comments", commentRepository.getComments);
router.post("/:postId/comments", authMiddleware, commentRepository.createComment);

module.exports = router;