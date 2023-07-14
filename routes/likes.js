const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth-middleware");
const { Posts, Users, Likes, sequelize } = require("../models");
const { Op } = require("sequelize");
const { parseModelToFlatObject } = require("../helpers/sequelize.helper");

// "sequelize"는 Node.js에서 사용되는 대표적인 ORM(Object-Relational Mapping) 라이브러리.

// 게시글 좋아요 API
// 12. 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 좋아요 가능
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  const findUser = await Users.findOne({
    where: {
      userId: userId,
    },
  });
  const findPost = await Posts.findOne({
    where: {
      postId: postId,
    },
  });
  // Likes 테이블 안에 전달받은 PostId와 UserId가 일치하는 자료가 존재하는지 확인.
  const existLike = await Likes.findOne({
    where: {
        PostId: postId,
        UserId: userId
    },
  });

  if (findUser.length <= 0) {
    return res
      .status(403)
      .json({ errorMessage: "로그인이 필요한 기능입니다." });
  }
  if (findPost.length <= 0) {
    return res
      .status(404)
      .json({ errorMessage: "게시글이 존재하지 않습니다." });
  }
  // 13. 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
  // existLike에 PostId와 UserId 자료가 존재하지 않는다면 Likes 데이터베이스에 PostId와 UserId를 생성한다.
  if (!existLike) {
    // 현재 userId와 현재 postId를 Likes 테이블에 생성한다.
    await Likes.create({ PostId: postId, UserId: userId });
    return res.status(201).json({ message: "게시글에 좋아요를 등록했습니다." });
  } else {
    await Likes.destroy({
      // 현재 userId와 현재 postId를 Likes 테이블에서 삭제한다.
      where: { PostId: postId, UserId: userId },
    });
    return res
      .status(200)
      .json({ message: "게시글의 좋아요를 취소하였습니다." });
  }
});

// 좋아요 게시글 조회 API
// "posts/like" 경로는 오류가 걸려 바로 "/like"로 지정
router.get("/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    // Likes 컬럼에서 전달받은 userId 값과 일치하는 userId 컬럼에 해당하는 속성값 postId를 myLikedPosts에 할당.
    // 현재 로그인 되어있는 userId가 like 한 모든 postId를 myLikedPosts에 할당.
    const myLikedPosts = await Likes.findAll({
      attributes: ["PostId"],
      where: { UserId: userId },
    });
    // myLikedPosts = post => post.PostId = PostId만 배열 []의 형태로 전개한다
    const myLikedPostIds = await myLikedPosts.map((post) => post.PostId);
    console.log(myLikedPostIds);
    // 14. 게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기
    const posts = await Posts.findAll({
      attributes: [
        "postId",
        "title",
        "nickname",
        "content",
        "createdAt",
        "updatedAt",
        // sequelize.fn()는 Sequelize에서 제공하는 함수를 사용하기 위한 함수를 사용하기 위한 메소드.
        // sequelize.col()은 Sequelize에서 제공하는 열을 나타내는 메서드.
        [sequelize.fn("COUNT", sequelize.col("Likes.UserId")), "likes"],
        // 'COUNT'는 COUNT함수를 쓰기 위한 표현법이며 Likes테이블을 참조하여 UserId 컬럼에 접근하고 그 컬럼의 갯수에 따라 'likes'라는 별칭을 부여.
      ],
      // Users, Likes 모델에 관계를 갖고 각각에 속성값을 지정하여 데이터를 가져온다.
      // 속성값을 지정했다면 선택적으로 결과를 볼 수 있다. 여기서 Likes모델의 attributes는 모든 속성값을 가져오도록 빈 배열로 설정하였음.
      // require: true는 Likes와의 관계가 필수적이라는 것을 나타내며 해당 관계가 존재하는 자료만을 가져오도록 한다.
      include: [
        {
          model: Users,
          attributes: ["userId"],
        },
        {
          model: Likes,
          attributes: [],
          required: true,
          // require:true는 Posts테이블과 Likes 테이블 간의 relationship(관계형성)을 필수적으로 요구하고 있다.
          // 정상적으로 관계를 형성하지 않았다면 이에 해당하는 오류가 뜬다.
        },
      ],
      // Posts테이블의 postId컬럼을 기준으로 그룹화 (공통적으로 postId값이 들어간 결과값을 그룹으로 묶음.)
      group: ["Posts.postId"],
      // 15. 제일 좋아요가 많은 게시글을 맨 위에 정렬하기 (내림차순)
      // 그룹의 정렬은 Likes 테이블의 UserId를 기준으로 내림차순으로 설정.
      order: [[sequelize.fn("COUNT", sequelize.col("Likes.UserId")), "DESC"]],
      // 객체형식을 순수한 데이터로 반환.
      raw: true,
      // myLikedPostIds에서 postId컬럼과 일치하는 자료만을 선택.
      where: {
        postId: {
          // [Op.in]은 sequelize에서 쓰는 연산자
          [Op.in]: myLikedPostIds,
        },
      },
    }).then((models) => models.map(parseModelToFlatObject));
    return res.status(200).json({ data: posts });
  } catch (error) {
    console.error(error.message);
    return res
      .status(403)
      .json({ errorMessage: "좋아요 조회에 실패하였습니다." });
  }
});


