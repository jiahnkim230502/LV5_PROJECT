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
};

module.exports = CommentService;