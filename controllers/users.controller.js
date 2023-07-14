const UserService = require("../services/users.service.js");

class UsersController {
  userService = new UserService();

  createUser = async (req, res, next) => {
    try {
      const { email, password, checkPassword, name, age, gender, nickname } = req.body;

      if (email.length <= 0 || name.length <= 0 || nickname.length <= 0)
        throw new Error("InvalidParamsError");

      if (checkPassword !== password)
        throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");

      if (nickname.length < 3 || !/[A-Z]/.test(nickname) || !/[0-9]/.test(nickname))
        throw new Error("닉네임은 최소 3자 이상, 알파벳 대문자와 숫자를 포함하여야 합니다.");

      if (password.length < 4 || password.includes(nickname))
        throw new Error("비밀번호는 4자 이상이며 기재하신 닉네임을 포함할 수 없습니다.");

      const createUserData = await this.userService.createUser(
        email,
        password,
        name,
        age,
        gender,
        nickname
      );

      res.status(201).json({data: createUserData});
    } catch (error) { 
      res.status(400).json({ eorrorMessage: error.message})
    }
  };
}

module.exports = UsersController;