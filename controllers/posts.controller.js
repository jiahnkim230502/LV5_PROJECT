const PostService = require("../services/posts.service");
const UserService = require("../services/users.service.js");

class PostsController {
  postService = new PostService();
  userService = new UserService();

  getPosts = async (req, res, next) => {
    const posts = await this.postService.findAllPost();

    res.status(200).json({ data: posts });
  };

  getPostById = async (req, res, next) => {
    const { postId } = req.params;
    const post = await this.postService.findPostById(postId);

    res.status(200).json({ data: post });
  };

  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { nickname, password, title, content } = req.body;

      const existUser = await this.userService.findUserInfo(userId);

      if (!existUser)
        throw new Error("로그인 후 이용 가능합니다.")

      if (!nickname || !password || !title)
        throw new Error("InvalidParamsError");
      const createPostData = await this.postService.createPost(
        userId,
        nickname,
        password,
        title,
        content
      );

      res.status(201).json({ data: createPostData });
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { nickname } = res.locals.user;
      const { postId } = req.params;
      const { title, content } = req.body;

      const post = await this.postService.findPostById(postId);

      console.log(post);

      if (!post) 
      throw new Error("Post doesn't exist");

      if (post.nickname !== nickname)
        throw new Error("사용자가 일치하지 않습니다.");

      const updatePost = await this.postService.updatePost(
        postId,
        nickname,
        title,
        content
      );

      res.status(200).json({ data: updatePost });
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }

  };

  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { password } = req.body;

    const deletePost = await this.postService.deletePost(postId, password);

    res.status(200).json({ data: deletePost });
  };
}

module.exports = PostsController;
