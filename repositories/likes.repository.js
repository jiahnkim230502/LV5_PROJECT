class LikeRepository {
  constructor(likesModel) {
    this.likesModel = likesModel;
  };

  findLike = async (postId, userId) => {
    const findLikeData = await this.likesModel.findOne({ where: { postId, userId } });

    return findLikeData
  };

  createLike = async (postId, userId) => {
    const createLikeData = await this.likesModel.create({ postId, userId });

    return createLikeData;
  };

  deleteLike = async (postId, userId) => {
    const deleteLikeData = await this.likesModel.destroy({ where: { postId, userId } });

    return deleteLikeData;
  }
};

module.exports = LikeRepository;