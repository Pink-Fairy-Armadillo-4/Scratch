const express = require('express');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.get('/allUsers', dbController.getUsers, (req, res) => {
  res.status(200).json(res.locals.users);
});

router.get('/allUserGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.userGroups);
});

router.get('/allSkills', dbController.getSkills, (req, res) => {
  res.status(200).json(res.locals.skills);
});

router.get('/allSkillGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.skillGroups);
});

module.exports = router;
