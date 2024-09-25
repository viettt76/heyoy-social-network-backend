const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');

const userRepository = AppDataSource.getRepository(User);

class UserController {
  // [GET] /user/personal-info
  async getPersonalInfo(req, res, next) {
    const { id } = req.userToken;

    const user = await userRepository.findOneBy({
      id,
    });

    if (user) {
      res.status(200).json({
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        birthday: user.birthday,
        homeTown: user.homeTown,
        school: user.school,
        workplace: user.workplace,
        avatar: user.avatar,
      });
    } else {
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.status(404).json({
        message: 'The user does not exist',
      });
    }
  }

  // [PUT] /user/personal-info
  async updatePersonalInfo(req, res, next) {
    const { id } = req.userToken;
    const { homeTown, school, workplace, avatar, birthday } = req.body;
    const user = await userRepository.findOneBy({
      id,
    });

    if (user) {
      if (homeTown !== null) user.homeTown = homeTown !== '' ? homeTown : null;
      if (school !== null) user.school = school !== '' ? school : null;
      if (workplace !== null)
        user.workplace = workplace !== '' ? workplace : null;
      if (avatar !== null) user.avatar = avatar;
      if (birthday !== null) user.birthday = birthday;

      await userRepository.save(user);

      return res.status(204).json();
    }

    throw new ApiError(404, "Couldn't update personal info");
  }
}

module.exports = new UserController();
