const UserRepository = require("../repositories/users.repository.js");

const jwt = require("jsonwebtoken");
const { Users } = require("../models/index.js");

class UserService {
  userRepository = new UserRepository(Users);

  findOneUser = async (email) => {
    const user = await this.userRepository.findOneUser(email);

    return user;
  }

  findUserById = async (userId) => {
    const user = await this.userRepository.findUserById(userId);

    return {
      email: user.email,
      password: user.password,
      name: user.name,
      age: user.age,
      gender: user.gender,
      nickname: user.nickname,
    };
  };

  createUser = async (email, password, name, age, gender, nickname) => {

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
};

module.exports = UserService