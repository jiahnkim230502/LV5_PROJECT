class UserRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  findOneUser = async (email) => {
    const user = await this.usersModel.findOne({ where: { email: email } });

    return user;
  };

  createUser = async (email, password, name, age, gender, nickname) => {
    const createUserData = await this.usersModel.create({
      email,
      password,
      name,
      age,
      gender,
      nickname,
    });

    return createUserData;
  };

  findUserInfo = async (userId) => {
    const userData = await this.usersModel.findByPk(userId);

    return userData;
  };
};

module.exports = UserRepository;