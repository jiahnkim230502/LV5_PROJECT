const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

  try {
    const decodedToken = jwt.verify(authToken, process.env.COOKIE_SECRET);
    const userId = decodedToken.userId;

    const user = await Users.findOne({
      where: {
        userId: userId,
      },
    });
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
