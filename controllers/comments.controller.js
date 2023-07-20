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
    }
  }

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
};

module.exports = CommentController;