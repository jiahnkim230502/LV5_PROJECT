const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const { Posts } = require("../models");
const { Users } = require("../models");
const { Comments } = require("../models");
const { Op } = require("sequelize");

// 게시글 목록 조회 API
// 1. 로그인 토큰을 전달하지 않아도 댓글 목록 조회가 가능하도록 하기
router.get("/posts/:postId/comments", async (req, res) => {
  // 2. 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
  const comments = await Comments.findAll({
    attributes: ["postId", "commentId", "content", "createdAt", "updatedAt"],
    // 3. 작성 날짜 기준으로 내림차순 정렬하기
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: comments });
});

// 게시글에 대한 댓글 작성 API
// 4. 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;

  const findPost = await Posts.findOne({
    where: {
      postId,
    },
  });
  const findUser = await Users.findOne({
    where: {
      userId,
    },
  });

  // 5. 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
  if (content.length === 0) {
    return res.status(404).json({ message: "댓글 내용을 입력해주세요." });
  }
  if (findUser.length <= 0) {
    return res.status(404).json({ message: "사용자가 존재하지 않습니다." });
  }
  if (findPost.length <= 0) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  }

  // 6. 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
  const comment = await Comments.create({
    PostId: postId,
    UserId: userId,
    content,
  });

  return res.status(201).json({ data: comment });
});

// 댓글 수정 API
// 7. 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { content } = req.body;

    const CommentId = await Comments.findOne({
      where: { commentId },
    });

    if (CommentId.UserId !== userId) {
      return res.status(404).json({
        message: "사용자가 일치하지 않습니다.",
      });
    }
    // 8. 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    if (content.length === 0) {
      return res.status(403).json({
        message: "댓글 내용을 입력해주세요.",
      });
    }

    // 9. 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
    await Comments.update(
      { content },
      {
        where: {
          [Op.and]: [{ postId }, { commentId }],
        },
      }
    );

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
  }
);

// 댓글 삭제 API
// 10. 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const CommentId = await Comments.findOne({
      where: { commentId },
    });

    if (!CommentId) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다.",
      });
    } else if (CommentId.UserId !== userId) {
      return res.status(403).json({
        message: "게시글 삭제 권한이 있는 사용자가 아닙니다.",
      });
    }

    // 11. 원하는 댓글을 삭제하기
    await Comments.destroy({
      where: {
        [Op.and]: [{ userId }, { commentId }],
      },
    });

    return res.status(200).json({ message: "게시글이 삭제되었습니다." });
  }
);

module.exports = router;
