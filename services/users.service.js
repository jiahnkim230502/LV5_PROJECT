const UserRepository = require("../repositories/users.repository.js");

const { Users } = require("../models/index.js");

class UserService {
  userRepository = new UserRepository(Users);

  findUserInfo = async (userId) => {
    const userData = await this.userRepository.findUserInfo(userId);

    return {
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    }
  }

  findOneUser = async (email) => {
    const user = await this.userRepository.findOneUser(email);

    return user;
  }

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