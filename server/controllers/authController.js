const models = require('../models/pfaModels');
const bcrypt = require('bcryptjs');

const authController = {};

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
    next()
  } catch (err) {
    next({
      log: 'Express error handler caught an error at authController.verifyUser',
      message: {err},
    });
  }
};

module.exports = authController;