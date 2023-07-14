class UserRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  findOneUser = async (email) => {
    const user = await this.usersModel.findOne({email});

    return user;
  }

  findUserById = async (userId) => {
    const user = await this.usersModel.findByPk(userId);

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
}

module.exports = UserRepository;