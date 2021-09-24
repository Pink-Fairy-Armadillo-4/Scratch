const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


router.post('/login', authController.verifyUser, (req, res) => {
  // testing purpose 
  console.log(res.locals.verification);

  res.status(200).json(res.locals.verification);
});


router.get('/login', authController.verifyUser, (req, res) => {
  // testing purpose 
  console.log(res.locals.verification);

  res.status(200).json(res.locals.verification);
});

module.exports = router;
