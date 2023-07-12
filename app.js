const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.js");
const postRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comment.js");
const likeRouter = require("./routes/likes.js")
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [userRouter, postRouter, commentRouter, likeRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})