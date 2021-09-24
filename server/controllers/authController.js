const models = require('../models/pfaModels');
const bcrypt = require('bcryptjs');

const authController = {};

function validateEmail(str) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(str).toLowerCase());
}

authController.verifyUser = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      res.locals.verification = false;
      next();
    }
    // object specifying the filters on query
    const queryFilter = {
      email,
      password
    };

    // object specifying the fields to be requested from db
    const specifiedFields = {
      _id: 0,
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
    };
      
    const verification = {
      hasLogged : false
    };

    const user = await models.User.findOne(queryFilter, specifiedFields);
    if (user) {
      verification.hasLogged = true;
      verification.userInfo = user;
    }
    res.locals.verification = verification;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught an error at authController.verifyUser',
      message: {err},
    });
  }
};

authController.createUser = async (req, res, next) => {
  try {
    const {email, password, firstName, lastName, skillsToTeach} = req.body;
    const verification = {
      hasLogged : false
    };
    console.log(req.body);
    if (!email || !password || !firstName || !lastName || !skillsToTeach) {
      res.locals.verification = verification;
      return next();
    }

    if (!validateEmail(email)) {
      verification.hasLogged = 'format';
      res.locals.verification = verification;
      return next();
    }

    const teach = [];
    for (const key in skillsToTeach) {
      teach.push({name: key, id: skillsToTeach[key]});
    }

    // object specifying the filters on query
    const userDoc = {
      email,
      password,
      firstName,
      lastName,
      teach
    };

    console.log('user doc submit:', userDoc);
    // object specifying the fields to be returned from db
    const specifiedFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
      isAdmin: 1,
    };
    console.log('hit db lines');
    const emailExist = await models.User.findOne({email});

    if (emailExist) {
      res.locals.verification = verification;
      return next();
    }

    const user = await models.User.create(userDoc);
    verification.hasLogged = true;
    verification.userInfo = {};

    // pull requested fields from user info returned from db
    for (const key in specifiedFields) {
      verification.userInfo[key] = user[key];
    }

    res.locals.verification = verification;
    console.log('verification: ', verification);
    return next();
  } catch (err) {
    console.log(err);
    next({
      log: 'Express error handler caught an error at authController.verifyUser',
      message: {err},
    });
  }
};

module.exports = authController;