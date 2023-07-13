const express = require("express");
const app = express();
const PORT = 3018;

const routes = require("./routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})