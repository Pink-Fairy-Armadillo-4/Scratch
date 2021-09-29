const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post(
  '/signup',
  authController.createUser,
  authController.createSession,
  (req, res) => {
    let statusCode = 200;
    if (
      res.locals.verification.hasLogged == false ||
      res.locals.verification.hasLogged == 'format' ||
      res.locals.verification.hasLogged == 'empty'
    ) {
      statusCode = 401;
    }

    res.status(statusCode).json(res.locals.verification);
  }
);

router.post(
  '/login',
  authController.verifyUser,
  authController.createSession,
  (req, res) => {
    // testing purpose
    console.log(res.locals.verification);
    let statusCode = 200;
    if (res.locals.verification.hasLogged == false) {
      statusCode = 401;
    }
    res.status(statusCode).json(res.locals.verification);
  }
);

router.post('/verify', authController.verifyToken,  (req, res) => {
  res.locals.tokenVerif === true
    ? res.status(200).json({verified: true})
    : res.status(401).json({verified: false});
});

module.exports = router;
