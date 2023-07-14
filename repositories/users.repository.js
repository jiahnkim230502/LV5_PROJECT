class UserRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }
  findOneUser = async () => {
    const user = await this.usersModel.findOne();

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

  loginUser = async (email, password, nickname) => {
    const loginUserData = await this.
  }
}
