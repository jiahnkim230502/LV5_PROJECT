const CommentRepository = require("../repositories/comments.repository.js");
const PostRepository = require("../repositories/posts.repository.js");

const { Comments, Posts } = require("../models/index.js");

class CommentService {
  commentRepository = new CommentRepository(Comments);
  postRepository = new PostRepository(Posts);

  findAllComments = async (postId) => {
    const comments = await this.commentRepository.findAllComments(postId);

    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return comments.map((comment) => {
      return {
        commentId: comment.commentId,
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
      }
    });
  };

  createComment = async (postId, userId, content) => {
    const findPost = await this.postRepository.findPostById(postId);

    if (!findPost)
      throw new Error("게시글이 존재하지 않습니다.");

    if (content.length <= 0)
      throw new Error("댓글 내용을 입력해주세요.");

    const createCommentData = await this.commentRepository.createComment(
      postId,
      userId,
      content,
    );

    return {
      postId: createCommentData.postId,
      userId: createCommentData.userId,
      content: createCommentData.content,
    };
  };

  updateComment = async (postId, commentId, userId, content) => {
    const comment = await this.commentRepository.findCommentId(commentId);

    if (comment.userId !== userId)
      throw new Error("댓글 수정 권한이 없습니다.");

    if (content.length <= 0)
      throw new Error("댓글 내용을 입력해주세요.");

    await this.commentRepository.updateComment(
      commentId,
      postId,
      userId,
      content,
    );

    const updateCommentData = await this.commentRepository.findCommentId(commentId);

    return {
      commentId: updateCommentData.commentId,
      postId: updateCommentData.postId,
      userId: updateCommentData.userId,
      content: updateCommentData.content,
    };
  };

  deleteComment = async (commentId, userId) => {
    const comment = await this.commentRepository.findCommentId(commentId);

    console.log(userId);

    if (comment.userId !== userId)
      throw new Error("댓글 삭제 권한이 없습니다.");

    await this.commentRepository.deleteComment(commentId, userId);

    return {
      commentId: comment.commentId,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
    };
  };
};

module.exports = CommentService;