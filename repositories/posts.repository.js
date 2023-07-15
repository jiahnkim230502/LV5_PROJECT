class PostRepository {
  constructor(postsModel) {
    this.postsModel = postsModel;
  }
  findAllPost = async () => {
    const posts = await this.postsModel.findAll();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await this.postsModel.findByPk(postId);

    return post;
  };

  createPost = async (userId, nickname, password, title, content) => {
    const createPostData = await this.postsModel.create({
      UserId: userId,
      nickname,
      password,
      title,
      content,
    });

    return createPostData;
  };

  updatePost = async (postId, nickname, title, content) => {
    const updatePostData = await this.postsModel.update(
      { title, content },
      { where: { postId, nickname } }
    );

    return updatePostData;
  };

  deletePost = async (postId, password) => {
    const updatePostData = await this.postsModel.destroy({ where: { postId, password } });

    return updatePostData;
  };
};

module.exports = PostRepository;
