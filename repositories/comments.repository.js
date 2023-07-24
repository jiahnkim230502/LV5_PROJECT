class CommentRepository {
  constructor(commentsModel) {
    this.commentsModel = commentsModel;
  };

  findCommentId = async (commentId) => {
    const findCommentId = await this.commentsModel.findOne({ where: { commentId } });

    return findCommentId;
  };

  findAllComments = async (postId) => {
    const comments = await this.commentsModel.findAll({ where: { postId } });

    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return comments;
  };

  createComment = async (postId, userId, content) => {
    const createCommentData = await this.commentsModel.create({
      postId,
      userId,
      content,
    });

    return createCommentData;
  };

  updateComment = async (postId, commentId, userId, content) => {
    const updateCommentData = await this.commentsModel.update(
      { postId, content },
      { where: { userId, commentId } }
    );

    return updateCommentData;
  };

  deleteComment = async (commentId, userId) => {
    const deleteCommentData = await this.commentsModel.destroy({ where: { commentId, userId } });

    return deleteCommentData;
  };
};

module.exports = CommentRepository;