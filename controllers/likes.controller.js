const LikesService = require("../services/likes.service");

class LikesController {
  likesService = new LikesService();

  createLike = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const likeOrUnlike = await this.likesService.createLike(postId, userId);

      res.status(likeOrUnlike.status).json({ message: likeOrUnlike.message });
    } catch (error) {
      res.status(404).json({ errorMessage: error.message })
    }
  };
};

module.exports = LikesController;