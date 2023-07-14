const UserService = require("../services/users.service.js");
const jwt = require("jsonwebtoken");

require("dotenv").config();

class UsersController {
  userService = new UserService();

  createUser = async (req, res, next) => {
    try {
      const { email, password, checkPassword, name, age, gender, nickname } = req.body;

      const existUser = await this.userService.findOneUser(email);

      if (existUser) {
        throw new Error("이미 존재하는 이메일입니다.");
      }
      if (email.length <= 0 || name.length <= 0 || nickname.length <= 0) {
        throw new Error("InvalidParamsError");
      }

      if (checkPassword !== password) {
        throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      }

      if (nickname.length < 3 || !/[A-Z]/.test(nickname) || !/[0-9]/.test(nickname)) {
        throw new Error("닉네임은 최소 3자 이상, 알파벳 대문자와 숫자를 포함하여야 합니다.");
      }

      if (password.length < 4 || password.includes(nickname)) {
        throw new Error("비밀번호는 4자 이상이며 기재하신 닉네임을 포함할 수 없습니다.");
      }

      const createUserData = await this.userService.createUser(
        email,
        password,
        name,
        age,
        gender,
        nickname
      );

      res.status(201).json({ data: createUserData });
    } catch (error) {
      res.status(400).json({ eorrorMessage: error.message })
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { email, password, nickname } = req.body;

      const findUser = await this.userService.findOneUser(email);

      if (findUser.password !== password || findUser.nickname !== nickname) {
        throw new Error("닉네임 또는 패스워드를 확인해주세요.")
      }

      const token = jwt.sign({ userId: findUser.userId }, process.env.COOKIE_SECRET);

      res.cookie("Authorization", `Bearer ${token}`);

      return res.status(200).json({ message: "로그인에 성공하였습니다." });

    } catch (error) {
      res.status(400).json({ eorrorMessage: error.message });
    };
  };

  getUser = async (req, res, next) => {
    const { userId } = req.params
    const userInfo = await this.userService.findUserInfo(userId);

    res.status(200).json({ data : userInfo});
  }
};

module.exports = UsersController;