require('dotenv').config();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { AppDataSource } = require('../data-source');
const { User } = require('../entity/User');

const userRepository = AppDataSource.getRepository(User);

class AuthController {
  // [POST] /auth/signup
  async signup(req, res, next) {
    try {
      const { firstName, lastName, username, password } = req.body;

      const user = await userRepository.findOne({
        where: { username: username },
      });
      if (!!user) {
        return res.status(400).json({
          message: 'Username is already in use',
        });
      } else {
        const hashPassword = await bcrypt.hashSync(password, saltRounds);

        await userRepository.save({
          firstName,
          lastName,
          username,
          password: hashPassword,
        });

        return res.status(201).json();
      }
    } catch (error) {
      next(error);
    }
  }

  // [POST] /auth/login
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await userRepository.findOne({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'The username or password you entered is incorrect.',
        });
      }

      const checkPassword = await bcrypt.compareSync(password, user.password);

      if (checkPassword) {
        const jwtSecret = process.env.JWT_SECRET;

        const payload = {
          id: user?.id,
          role: 'user',
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: 15 * 60 });
        const refreshToken = jwt.sign(payload, jwtSecret, {
          expiresIn: 15 * 24 * 60 * 60,
        });

        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json();
      } else {
        res.status(401).json({
          error: 'Invalid credentials',
          message: 'The username or password you entered is incorrect.',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /auth/personal-info
  async getPersonalInfo(req, res, next) {
    try {
      const user = await userRepository.findOne({
        where: { id: req.userToken.id },
      });

      if (user) {
        res.status(200).json({
          id: user.id,
          lastName: user.lastName,
          firstName: user.firstName,
          age: user.age,
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
    } catch (error) {
      next(error);
    }
  }

  // [POST] /auth/logout
  logout(req, res, next) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.status(200).json();
  }
}

module.exports = new AuthController();
