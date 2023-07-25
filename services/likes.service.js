const LikeRepository = require("../repositories/likes.repository.js");
const UserRepository = require("../repositories/users.repository.js");
const PostRepository = require("../repositories/posts.repository.js");

const { Likes, Users, Posts } = require("../models/index.js");

class LikeService {
  likeRepository = new LikeRepository(Likes);
  userRepository = new UserRepository(Users);
  postRepository = new PostRepository(Posts);

  createLike = async (postId, userId) => {
    const findUser = await this.userRepository.findUserInfo(userId);
    const existLike = await this.likeRepository.findLike(postId, userId);
    const existPost = await this.postRepository.findPostById(postId);

    if (findUser.length <= 0)
      throw new Error("로그인 후 이용 가능합니다.");

    if (!existPost)
      throw new Error("게시물이 존재하지 않습니다.");

    if (!existLike) {
      await this.likeRepository.createLike(postId, userId);

      return {
        status: 201,
        message: "게시글에 좋아요를 등록하셨습니다."
      };
    } else {
      await this.likeRepository.deleteLike(postId, userId);

      return {
        status: 200,
        message: "게시글의 좋아요를 취소하셨습니다."
      };
    };
  };
};

module.exports = LikeService;