const express = require('express');
const dbController = require('../controllers/dbController');
const authController = require('../controllers/authController');
const graphController = require('../controllers/graphController');

const router = express.Router();

router.get('/allUsers', dbController.getUsers, (req, res) => {
  res.status(200).json(res.locals.users);
});

router.get('/allUserGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.userGroups);
});

router.get('/allSkills/:skill', dbController.getSkills, (req, res) => {
  res.status(200).json(res.locals.skills);
});

router.get('/allSkillGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.skillGroups);
});

router.get('/messages/:targetEmail', dbController.getMessages, (req, res) => {
  res.status(200).json(res.locals.messages);
});

router.get(
  '/nodes/:skill',
  dbController.getSkills,
  graphController.createNodes,
  (req, res) => {
    const data = {
      skills: res.locals.skillName,
      nodes: res.locals.nodes,
      links: res.locals.links,
    };
    res.status(200).json(data);
  }
);

router.post('/sendMessage', dbController.createMessage, (req, res) => {
  res.status(200).json(true);
});

router.delete('/delMessage', dbController.delMessages, dbController.getMessages, (req, res) => {
  res.status(200).json(res.locals.messages);
});

module.exports = router;
