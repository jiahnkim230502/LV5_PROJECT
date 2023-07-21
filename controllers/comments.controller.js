const CommentService = require("../services/comments.service");

class CommentController {
  commentService = new CommentService();

  getComments = async (req, res) => {
    try {
      const { postId } = req.params;

      const getComments = await this.commentService.findAllComments(postId);

      res.status(200).json({ data: getComments });

    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    };
  };

  createComment = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { content } = req.body;

      const createComment = await this.commentService.createComment(
        userId,
        postId,
        content,
      );

      res.status(201).json({ data: createComment });

    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    };
  };

  updateComment = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postId, commentId } = req.params;
      const { content } = req.body;

      const updateComment = await this.commentService.updateComment(
        postId,
        commentId,
        userId,
        content,
      );

      res.status(200).json({ data: updateComment });

    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    };
  };

  deleteComment = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { commentId } = req.params;

      const deleteComment = await this.commentService.deleteComment(commentId, userId);

      res.status(200).json({ data: deleteComment });
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }
  };
};

module.exports = CommentController;