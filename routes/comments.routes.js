const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = require("../controllers/comments.controller");
const commentRepository = new CommentController();

router.get("/:postId/comments", commentRepository.getComments);
router.post("/:postId/comments", authMiddleware, commentRepository.createComment);
router.put("/:postId/comments/:commentId", authMiddleware, commentRepository.updateComment);
router.delete("/:postId/comments/:commentId", authMiddleware, commentRepository.deleteComment);

module.exports = router;