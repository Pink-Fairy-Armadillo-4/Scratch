const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


router.post('/login', authController.verifyUser, (req, res) => {
  // testing purpose 
  console.log(res.locals.verification);

  res.status(200).json(res.locals.verification);
});

router.post('/signup', authController.createUser, (req, res) => {
  let statusCode = 200;
  if (res.locals.verification.hasLogged == false || res.locals.verification.hasLogged == 'format') {
    statusCode = 401;
  }

  res.status(statusCode).json(res.locals.verification);
});

router.get('/login', authController.verifyUser, (req, res) => {
  // testing purpose 
  console.log(res.locals.verification);

  res.status(200).json(res.locals.verification);
});

module.exports = router;
