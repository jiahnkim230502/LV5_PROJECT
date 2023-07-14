const UserRepository = require("../repositories/users.repository.js");

const jwt = require("jsonwebtoken");
const { Users } = require("../models/index.js");

class UserService {
  userRepository = new UserRepository(Users);

  findUserById = async (userId) => {
    const findUser = await this.userRepository.findUserById(userId);

    return {
      email: findUser.email,
      password: findUser.password,
      name: findUser.name,
      age: findUser.age,
      gender: findUser.gender,
      nickname: findUser.nickname,
    };
  };

  createUser = async (email, password, name, age, gender, nickname) => {
    const existUser = await this.userRepository.findOneUser({email});

    if (existUser) throw new Error("이미 존재하는 이메일입니다.");

    const createUserData = await this.userRepository.createUser(
      email,
      password,
      name,
      age,
      gender,
      nickname
    );
    return {
      email: createUserData.email,
      password: createUserData.password,
      name: createUserData.name,
      age: createUserData.age,
      gender: createUserData.gender,
      nickname: createUserData.nickname,
    };
  };

  loginUser = async (email, nickname, password) => {
    const user = await this.userRepository.findOneUser(email);

    if (user.nickname !== nickname || user.password !== password)
      throw new Error("닉네임 또는 패스워드를 확인해주세요.");
  };
};

module.exports = UserService