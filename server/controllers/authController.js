const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');

const authController = {};

function validateEmail(str) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(str).toLowerCase());
}

authController.verifyUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.locals.verification = {
        hasLogged: false,
      };
      return next();
    }

    // object specifying the fields to be requested from db
    const specifiedFields = {
      _id: 0,
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
      newMessage: 1,
    };

    const verification = {
      hasLogged: false,
    };

    const user = await User.findOne({ email });

    if (!user || (await user.verify(password)) === false) {
      verification.hasLogged = false;
      res.locals.verification = verification;
      return next();
    } else if (user && (await user.verify(password)) === true) {
      verification.hasLogged = true;
      verification.userInfo = {};
      for (const key in specifiedFields) {
        verification.userInfo[key] = user[key];
      }

      if (user.newMessage) {
        await User.updateOne({ email }, { $set: { newMessage: false } });
      }

      res.locals.verification = verification;
      return next();
    }
  } catch (err) {
    return next(err);
  }
};

authController.createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, skillsToTeach } = req.body;
    const verification = {
      hasLogged: false,
    };
    // console.log(req.body);
    if (!email || !password || !firstName || !lastName) {
      res.locals.verification = {
        hasLogged: 'empty',
      };
      return next();
    }
    if (!validateEmail(email)) {
      verification.hasLogged = 'format';
      res.locals.verification = verification;
      return next();
    }

    const teach = [];
    for (const key in skillsToTeach) {
      teach.push({
        name: key,
        _id: mongoose.Types.ObjectId(skillsToTeach[key]),
      });
    }

    // object specifying the filters on query
    const userDoc = {
      email,
      password,
      firstName,
      lastName,
      teach,
    };

    // console.log('user doc submit:', userDoc);
    // object specifying the fields to be returned from db
    const specifiedFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
      newMessage: 1,
    };
    // console.log('hit db lines');
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      res.locals.verification = verification;
      return next();
    }

    const user = await User.create(userDoc);

    // update teachers in skill to reflect the new user
    const newTeacher = {
      firstName,
      lastName,
      email,
      _id: user._id,
    };

    const skills = Object.keys(skillsToTeach);
    if (skills.length != 0) {
      await Skill.updateMany({ name: { $in: skills } }, { $push: { teachers: newTeacher } });
    }

    verification.hasLogged = true;
    verification.userInfo = {};

    // pull requested fields from user info returned from db
    for (const key in specifiedFields) {
      verification.userInfo[key] = user[key];
    }

    res.locals.verification = verification;
    // console.log('verification: ', verification);
    return next();
  } catch (err) {
    return next(err);
  }
};

authController.createSession = async (req, res, next) => {
  try {
    if (res.locals.verification.hasLogged !== true) {
      return next();
    }
    const token = await jwt.sign({ id: req.body.email }, process.env.ID_SALT);
    res.cookie('ssid', token, { maxAge: 300000 });
    return next();
  } catch (err) {
    console.log(err);
  }
};

authController.verifyToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    const isToken = await jwt.verify(token, process.env.ID_SALT);
    if (isToken.id) {
      console.log('isToken is', isToken);
      res.locals.tokenVerif = true;

      // const queryFilter = {
      //   targetEmail: isToken.id,
      // };

      // const specifiedFields = {};

      // const updateFields = {
      //   $set: {
      //     isRead: true,
      //   },
      // };

      // const messages = await models.Message.find(queryFilter, specifiedFields);
      // await models.Message.updateMany(queryFilter, updateFields);

      // res.locals.messages = messages;
    } else res.locals.tokenVerif = false;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = authController;
