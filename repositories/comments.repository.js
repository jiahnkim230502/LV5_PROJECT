class CommentRepository {
  constructor(commentsModel) {
    this.commentsModel = commentsModel;
  };

  findAllComments = async (postId) => {
    const comments = await this.commentsModel.findAll({ where: { postId } });

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
};

module.exports = CommentRepository;